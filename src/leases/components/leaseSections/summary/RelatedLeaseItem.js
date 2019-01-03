// @flow
import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import ExternalLink from '$components/links/ExternalLink';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {formatDate, getLabelOfOption} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getMethods as getRelatedLeaseMethods} from '$src/relatedLease/selectors';

import type {Methods} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  active?: boolean,
  id?: number,
  indented?: boolean,
  lease: Lease,
  onDelete?: Function,
  relatedLeaseMethods: Methods,
  stateOptions: Array<Object>,
}

const RelatedLeaseItem = ({
  active = false,
  id,
  indented = false,
  lease,
  onDelete,
  relatedLeaseMethods,
  stateOptions,
}: Props) => {
  const identifier = getContentLeaseIdentifier(lease);

  return (
    <AppConsumer>
      {({dispatch}) => {
        const handleDelete = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              if(onDelete) {
                onDelete(id);
              }
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText: 'Poista',
            confirmationModalLabel: DeleteModalLabels.RELATED_LEASE,
            confirmationModalTitle: DeleteModalTitles.RELATED_LEASE,
          });
        };

        return(
          <div className={classNames('related-leases-item', {'active': active}, {'indented': indented})}>
            <div className="related-leases-item_wrapper">
              <div className="left-border-overlay" />
              <div className="connection-line" />
              <div className={classNames('related-leases-item_badge')}></div>
              {!!active &&
                <div className={classNames('related-leases-item_info')}>
                  <p className="identifier">{identifier}</p>
                </div>
              }
              {!active &&
                <div className={classNames('related-leases-item_info')}>
                  <p className="identifier">
                    <ExternalLink
                      href={`${getRouteById('leases')}/${lease.id}`}
                      text={identifier || ''}
                    />
                  </p>
                  <p>{formatDate(lease.start_date)} - {formatDate(lease.end_date)}</p>
                  <p className="type">{getLabelOfOption(stateOptions, lease.state) || '-'}</p>

                  <Authorization allow={relatedLeaseMethods.DELETE}>
                    {onDelete &&
                      <RemoveButton
                        className='related-leases-item_remove-button'
                        onClick={handleDelete}
                        title='Poista liitos'
                      />
                    }
                  </Authorization>
                </div>
              }
            </div>
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default connect(
  (state) => {
    return {
      relatedLeaseMethods: getRelatedLeaseMethods(state),
    };
  }
)(RelatedLeaseItem);
