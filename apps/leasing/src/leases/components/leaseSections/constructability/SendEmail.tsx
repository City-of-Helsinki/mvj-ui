import React, { useEffect, useState } from "react";
import { Row, Column } from "react-foundation";
import { useSelector, useDispatch } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ListItem from "@/components/content/ListItem";
import SendEmailModal from "./SendEmailModal";
import { sendEmail } from "@/leases/actions";
import { ButtonColors } from "@/components/enums";
import { SendEmailTypes } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getContentConstructabilityEmail,
  getContentEmailLogs,
} from "@/leases/helpers";
import { getUserFullName } from "@/users/helpers";
import { formatDate, hasPermissions } from "@/util/helpers";
import { getLoggedInUser } from "@/auth/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

const SendEmail: React.FC = () => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const loggedUser: Record<string, any> = useSelector(getLoggedInUser);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const [emailLogs, setEmailLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setEmailLogs(getContentEmailLogs(currentLease));
  }, [currentLease]);

  const handleShowModal = () => {
    setIsOpen(true);
  };

  const handleHideModal = () => {
    setIsOpen(false);
  };

  const handleSend = (values: Record<string, any>) => {
    const payload = {
      recipients: values.recipients,
      text: getContentConstructabilityEmail(
        currentLease,
        loggedUser,
        values.text,
      ),
      type: SendEmailTypes.CONSTRUCTABILITY,
      lease: currentLease.id,
    };
    dispatch(sendEmail(payload));
    setIsOpen(false);
  };

  const getRecipientString = (recipients: Array<Record<string, any>>) =>
    recipients.map((recipient) => getUserFullName(recipient)).join(", ");

  return (
    <>
      <Authorization
        allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE)}
      >
        <SendEmailModal
          isOpen={isOpen}
          onCancel={handleHideModal}
          onClose={handleHideModal}
          onSend={handleSend}
        />
      </Authorization>

      <Row>
        <Column small={12} medium={4} large={3}>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.VIEW_LEASE,
            )}
          >
            <Button
              className={`${ButtonColors.NEUTRAL} no-margin`}
              onClick={handleShowModal}
              style={{
                marginBottom: 15,
              }}
              text="Lähetä sähköposti"
            />
          </Authorization>
        </Column>
        <Column small={12} medium={8} large={9}>
          <Authorization
            allow={
              hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_LEASE_LEASE_AREAS,
              ) ||
              hasPermissions(
                usersPermissions,
                UsersPermissions.CHANGE_LEASE_LEASE_AREAS,
              )
            }
          >
            <>
              {!emailLogs.length && (
                <FormText>Ei lähetettyjä sähköposteja</FormText>
              )}
              {!!emailLogs.length && (
                <div className="constructability__send-email_sent-emails">
                  <Row>
                    <Column small={4} medium={3} large={2}>
                      <FormTextTitle title="Lähetetty" />
                    </Column>
                    <Column small={4} medium={3} large={2}>
                      <FormTextTitle title="Lähettäjä" />
                    </Column>
                    <Column small={4} medium={6} large={8}>
                      <FormTextTitle title="Vastaanottajat" />
                    </Column>
                  </Row>
                  {emailLogs.map((email, index) => {
                    return (
                      <Row key={index}>
                        <Column small={4} medium={3} large={2}>
                          <ListItem>
                            {formatDate(email.created_at, "dd.MM.yyyy HH:mm") ||
                              "-"}
                          </ListItem>
                        </Column>
                        <Column small={4} medium={3} large={2}>
                          <ListItem>
                            {getUserFullName(email.user) || "-"}
                          </ListItem>
                        </Column>
                        <Column small={4} medium={6} large={8}>
                          <ListItem>
                            {getRecipientString(email.recipients) || "-"}
                          </ListItem>
                        </Column>
                      </Row>
                    );
                  })}
                </div>
              )}
            </>
          </Authorization>
        </Column>
      </Row>
    </>
  );
};

export default SendEmail;
