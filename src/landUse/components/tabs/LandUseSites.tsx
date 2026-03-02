import React, { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view";
import {
  Button,
  ButtonVariant,
  Notification,
  Select,
  TextInput,
} from "hds-react";
import { Form, Field } from "react-final-form";
import type { FormApi } from "final-form";
import { normalizeSelectValue } from "../../fieldUtils";
import { landUseCompensationSelectOptions } from "../../mocks/landUseMockData";
import { collectNonLeafNodeIds } from "../../utils/siteTree";

export interface LandUseSiteTreeNode {
  id: string;
  kohteenTunnus: string;
  pintaAlaM2?: string;
  km2?: string;
  kayttotarkoitus: string | undefined;
  hallintamuoto: string | undefined;
  suojeltu: string | undefined;
  label: string;
  children?: LandUseSiteTreeNode[];
}

export interface LandUseSitesFormValues {
  items: LandUseSiteTreeNode[];
}

interface LandUseSitesProps {
  form: FormApi<LandUseSitesFormValues>;
  isEditMode: boolean;
  isDecisionPhase: boolean;
}

const kayttotarkoitusOptions =
  landUseCompensationSelectOptions.kayttotarkoitus.map((value) => ({
    label: value,
    value,
  }));

const hallintamuotoOptions = landUseCompensationSelectOptions.hallintamuoto.map(
  (value) => ({
    label: value,
    value,
  }),
);

const suojeltuOptions = landUseCompensationSelectOptions.suojeltu.map(
  (value) => ({
    label: value,
    value,
  }),
);

const handleSelectChange = (
  selectedOptions: { label: string; value: string }[],
  callback: (value: string | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  } else {
    callback(undefined);
  }
};

const addChildToNode = (
  nodes: LandUseSiteTreeNode[],
  parentId: string,
  nodeToAdd: LandUseSiteTreeNode,
): LandUseSiteTreeNode[] => {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children ?? []), nodeToAdd],
      };
    }

    if (!node.children) {
      return node;
    }

    return {
      ...node,
      children: addChildToNode(node.children, parentId, nodeToAdd),
    };
  });
};

const removeNodeById = (
  nodes: LandUseSiteTreeNode[],
  itemId: string,
): LandUseSiteTreeNode[] => {
  return nodes
    .filter((node) => node.id !== itemId)
    .map((node) => ({
      ...node,
      children: node.children
        ? removeNodeById(node.children, itemId)
        : undefined,
    }));
};

const findNodeById = (
  nodes: LandUseSiteTreeNode[],
  itemId: string,
): LandUseSiteTreeNode | null => {
  for (const node of nodes) {
    if (node.id === itemId) {
      return node;
    }

    if (node.children) {
      const childMatch = findNodeById(node.children, itemId);
      if (childMatch) {
        return childMatch;
      }
    }
  }

  return null;
};

const collectNodeIds = (nodes: LandUseSiteTreeNode[]): Set<string> => {
  const ids = new Set<string>();

  const visit = (items: LandUseSiteTreeNode[]) => {
    items.forEach((item) => {
      ids.add(item.id);
      if (item.children?.length) {
        visit(item.children);
      }
    });
  };

  visit(nodes);
  return ids;
};

const createUniqueSiteId = (nodes: LandUseSiteTreeNode[]): string => {
  const usedIds = collectNodeIds(nodes);
  let index = 1;

  while (usedIds.has(`site-${index}`)) {
    index += 1;
  }

  return `site-${index}`;
};

const updateNodeIdentifier = (
  nodes: LandUseSiteTreeNode[],
  itemId: string,
  changes: Partial<
    Pick<
      LandUseSiteTreeNode,
      | "kohteenTunnus"
      | "pintaAlaM2"
      | "km2"
      | "kayttotarkoitus"
      | "hallintamuoto"
      | "suojeltu"
    >
  >,
): LandUseSiteTreeNode[] => {
  return nodes.map((node) => {
    if (node.id === itemId) {
      const updatedNode = {
        ...node,
        ...changes,
      };

      return {
        ...updatedNode,
        label: updatedNode.kohteenTunnus,
      };
    }

    if (!node.children) {
      return node;
    }

    return {
      ...node,
      children: updateNodeIdentifier(node.children, itemId, changes),
    };
  });
};

export const LandUseSites: React.FC<LandUseSitesProps> = ({
  form,
  isEditMode,
  isDecisionPhase,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [newKohdeTunnus, setNewKohdeTunnus] = useState("");
  const isSitesReadOnly = !isEditMode || isDecisionPhase;

  return (
    <Form<LandUseSitesFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const treeItems = values.items ?? [];
        const nonLeafNodeIds = collectNonLeafNodeIds(treeItems);
        const selectedNode = selectedItemId
          ? findNodeById(treeItems, selectedItemId)
          : null;

        const handleAddRoot = () => {
          const trimmedTunnus = newKohdeTunnus.trim();
          if (!trimmedTunnus || isSitesReadOnly) {
            return;
          }

          const node: LandUseSiteTreeNode = {
            id: createUniqueSiteId(treeItems),
            kohteenTunnus: trimmedTunnus,
            pintaAlaM2: "",
            km2: "",
            kayttotarkoitus: undefined,
            hallintamuoto: undefined,
            suojeltu: undefined,
            label: trimmedTunnus,
          };
          form.change("items", [...treeItems, node]);
          setNewKohdeTunnus("");
        };

        const handleAddChild = () => {
          const trimmedTunnus = newKohdeTunnus.trim();
          if (!trimmedTunnus || !selectedItemId || isSitesReadOnly) {
            return;
          }

          const node: LandUseSiteTreeNode = {
            id: createUniqueSiteId(treeItems),
            kohteenTunnus: trimmedTunnus,
            pintaAlaM2: "",
            km2: "",
            kayttotarkoitus: undefined,
            hallintamuoto: undefined,
            suojeltu: undefined,
            label: trimmedTunnus,
          };
          form.change("items", addChildToNode(treeItems, selectedItemId, node));
          setNewKohdeTunnus("");
        };

        const handleRemoveSelected = () => {
          if (!selectedItemId || isSitesReadOnly) {
            return;
          }

          form.change("items", removeNodeById(treeItems, selectedItemId));
          setSelectedItemId(null);
        };

        const detailsFieldId = selectedItemId
          ? `landuse-site-identifier-${selectedItemId}`
          : "landuse-site-identifier";

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">KOHTEET</h2>

              {isDecisionPhase && (
                <Notification
                  type="info"
                  position="inline"
                  label="Info"
                  style={{ marginBottom: "var(--spacing-m)" }}
                >
                  Kohteita ei voi muokata, kun sopimuksen tila on
                  &quot;Päätös&quot;.
                </Notification>
              )}

              <div className="landuse-detail__field-group landuse-detail__fieldset--with-margin">
                <TextInput
                  id="landuse-site-new-kohde-tunnus"
                  label="Uuden kohteen tunnus"
                  value={newKohdeTunnus}
                  onChange={(event) => setNewKohdeTunnus(event.target.value)}
                  disabled={isSitesReadOnly}
                />

                <div className="landuse-detail__actions">
                  <Button
                    variant={ButtonVariant.Secondary}
                    onClick={handleAddRoot}
                    disabled={isSitesReadOnly}
                  >
                    Lisää juurikohde
                  </Button>
                  <Button
                    variant={ButtonVariant.Secondary}
                    onClick={handleAddChild}
                    disabled={!selectedItemId || isSitesReadOnly}
                  >
                    Lisää alikohde
                  </Button>
                  <Button
                    variant={ButtonVariant.Danger}
                    onClick={handleRemoveSelected}
                    disabled={!selectedItemId || isSitesReadOnly}
                  >
                    Poista valittu
                  </Button>
                </div>
              </div>

              <div className="landuse-detail__split-view">
                <div className="landuse-detail__tree-wrapper landuse-detail__split-panel">
                  <RichTreeView
                    className="landuse-detail__sites-tree"
                    items={treeItems}
                    defaultExpandedItems={Array.from(collectNodeIds(treeItems))}
                    onItemClick={(_, itemId) => setSelectedItemId(itemId)}
                    slotProps={{
                      item: ({ itemId }) => ({
                        className: nonLeafNodeIds.has(itemId)
                          ? "landuse-detail__sites-tree-item--non-leaf"
                          : undefined,
                      }),
                    }}
                  />
                </div>

                <div className="landuse-detail__split-panel landuse-detail__details-panel">
                  <h3 className="landuse-detail__section-title">
                    Kohteen tiedot
                  </h3>
                  <Field name="items">
                    {() => (
                      <TextInput
                        id={detailsFieldId}
                        label="Kohteen tunnus"
                        value={selectedNode?.kohteenTunnus ?? ""}
                        onChange={(event) => {
                          if (!selectedItemId || isSitesReadOnly) {
                            return;
                          }

                          form.change(
                            "items",
                            updateNodeIdentifier(treeItems, selectedItemId, {
                              kohteenTunnus: event.target.value,
                            }),
                          );
                        }}
                        disabled={!selectedItemId || isSitesReadOnly}
                      />
                    )}
                  </Field>

                  <Field name="items">
                    {() => (
                      <TextInput
                        id="landuse-site-pinta-ala-m2"
                        label="Pinta-ala m²"
                        value={selectedNode?.pintaAlaM2 ?? ""}
                        onChange={(event) => {
                          if (!selectedItemId || isSitesReadOnly) {
                            return;
                          }

                          form.change(
                            "items",
                            updateNodeIdentifier(treeItems, selectedItemId, {
                              pintaAlaM2: event.target.value,
                            }),
                          );
                        }}
                        disabled={!selectedItemId || isSitesReadOnly}
                      />
                    )}
                  </Field>

                  <Field name="items">
                    {() => (
                      <TextInput
                        id="landuse-site-km2"
                        label="k-m²"
                        value={selectedNode?.km2 ?? ""}
                        onChange={(event) => {
                          if (!selectedItemId || isSitesReadOnly) {
                            return;
                          }

                          form.change(
                            "items",
                            updateNodeIdentifier(treeItems, selectedItemId, {
                              km2: event.target.value,
                            }),
                          );
                        }}
                        disabled={!selectedItemId || isSitesReadOnly}
                      />
                    )}
                  </Field>

                  <Field name="items">
                    {() => (
                      <Select
                        id="landuse-site-kayttotarkoitus"
                        options={kayttotarkoitusOptions}
                        value={normalizeSelectValue(
                          selectedNode?.kayttotarkoitus,
                        )}
                        onChange={(selectedOptions) => {
                          if (!selectedItemId || isSitesReadOnly) {
                            return;
                          }

                          handleSelectChange(selectedOptions, (value) => {
                            form.change(
                              "items",
                              updateNodeIdentifier(treeItems, selectedItemId, {
                                kayttotarkoitus: value,
                              }),
                            );
                          });
                        }}
                        texts={{
                          label: "Käyttötarkoitus",
                          placeholder: "Valitse",
                        }}
                        disabled={!selectedItemId || isSitesReadOnly}
                      />
                    )}
                  </Field>

                  <Field name="items">
                    {() => (
                      <Select
                        id="landuse-site-hallintamuoto"
                        options={hallintamuotoOptions}
                        value={normalizeSelectValue(
                          selectedNode?.hallintamuoto,
                        )}
                        onChange={(selectedOptions) => {
                          if (!selectedItemId || isSitesReadOnly) {
                            return;
                          }

                          handleSelectChange(selectedOptions, (value) => {
                            form.change(
                              "items",
                              updateNodeIdentifier(treeItems, selectedItemId, {
                                hallintamuoto: value,
                              }),
                            );
                          });
                        }}
                        texts={{
                          label: "Hallintamuoto",
                          placeholder: "Valitse",
                        }}
                        disabled={!selectedItemId || isSitesReadOnly}
                      />
                    )}
                  </Field>

                  <Field name="items">
                    {() => (
                      <Select
                        id="landuse-site-suojeltu"
                        options={suojeltuOptions}
                        value={normalizeSelectValue(selectedNode?.suojeltu)}
                        onChange={(selectedOptions) => {
                          if (!selectedItemId || isSitesReadOnly) {
                            return;
                          }

                          handleSelectChange(selectedOptions, (value) => {
                            form.change(
                              "items",
                              updateNodeIdentifier(treeItems, selectedItemId, {
                                suojeltu: value,
                              }),
                            );
                          });
                        }}
                        texts={{
                          label: "Suojeltu",
                          placeholder: "Valitse",
                        }}
                        disabled={!selectedItemId || isSitesReadOnly}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
