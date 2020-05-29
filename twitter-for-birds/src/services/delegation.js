import Cookies from 'js-cookie';
import config from '../config';
import http from './http';

export default class Delegation {
  static async GetRelationTypes() {
    const resp = await http.get(`${config.api_url}/delegation/delegationRelationTypes`);
    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }

  static async GetOwners() {
    const resp = await fetch(`${config.api_url}/delegation/${Cookies.get('phr_id')}/owners`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
      },
    });
    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }

  static async GetViewers() {
    const resp = await fetch(`${config.api_url}/delegation/${Cookies.get('phr_id')}/viewers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
      },
    });
    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }

  static async GetPendingViewers() {
    const resp = await fetch(`${config.api_url}/delegation/${Cookies.get('phr_id')}/pendingDelegationRequestsForViewer`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
      },
    });
    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }

  static async Revoke({ viewer_phr_id, owner_phr_id }) {
    const resp = await fetch(`${config.api_url}/delegation/revokeDelegation`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        viewer_phr_id,
        owner_phr_id,
        application_identity: {
          created_by: 'AdventHealth.com',
        },
      }),
    });
    if (!resp.ok) return Promise.reject(resp);
    return resp;
  }

  static async RejectPending({ viewer_phr_id, id: delegation_request_id }) {
    const resp = await fetch(`${config.api_url}/delegation/rejectPendingDelegationForViewer`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        viewer_phr_id,
        id: delegation_request_id,
        application_identity: {
          created_by: 'AdventHealth.com',
        },
      }),
    });
    if (!resp.ok) return Promise.reject(resp);
    return resp;
  }

  static async GrantPending({
    viewer_phr_id, owner_date_of_birth, id, delegation_permissions, delegation_relation_type,
  }) {
    const resp = await fetch(`${config.api_url}/delegation/grantPendingDelegation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        viewer_phr_id,
        owner_date_of_birth,
        delegation_relation_type,
        delegation_permissions,
        application_identity: {
          created_by: 'AdventHealth.com',
        },
      }),
    });

    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }

  static async SelfServiceDelegation({
    session_id,
    dob: date_of_birth,
    firstName: first_name,
    lastName: last_name,
    phone: phone_number,
  }) {
    const resp = await http.auth.post(`${config.api_url}/delegation/verifySelfServiceDelegation`, {
      body: {
        session_id,
        date_of_birth,
        first_name,
        last_name,
        phone_number,
        phr_id: Cookies.get('phr_id'),
        verification_type: 'delegation',
      },
    });
    if (!resp.ok) return Promise.reject(resp);
    return resp;
  }

  static async ValidateMRN(sessionID, mrn) {
    const resp = await http.auth.put(`${config.api_url}/delegation/${sessionID}/patient/${mrn}`);
    if (!resp.ok) return Promise.reject(resp);
    return resp;
  }

  static async EndSelfServiceDelegation(sessionID, mrn, relationship) {
    const resp = await http.auth.post(`${config.api_url}/delegation/${sessionID}/grantSelfServicePendingDelegation`, {
      body: {
        application_identity: {
          application: 'AdventHealth.com',
          internal: false,
          phrId: Cookies.get('phr_id'),
        },
        createdBy: 'string',
        delegation_permissions: [
          {
            delegation_permission: 'string',
            id: 2,
          },
        ],
        delegation_relation_type: {
          id: relationship.id,
          owner_relation: relationship.owner_relation,
          viewer_relation: relationship.viewer_relation,
        },
        viewer_phr_id: Cookies.get('phr_id'),
        source_value: mrn,
      },
    });

    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }
}
