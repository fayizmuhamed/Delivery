import { acceptor } from '../constants/languages';
import * as api from '../constants/services';
 
let fetchUrl;

// user login
export const loginUser = (companyId, mobileno, password) => {
	this.fetchUrl = api.domainUrl + api.loginUrl;
    let data =	api.loginContentUrl + api.loginUsername + mobileno + api.loginPassword + password +  api.companyidUrl + companyId + api.loginType;

	return fetch(this.fetchUrl, {
		method: 'POST',
		body: data
    }).then(processResponse);
}

// get employee info
export const getEmployeeInfo = (companyId, token) => {
	this.fetchUrl = api.domainUrl + api.employeeUrl 
	return fetch(this.fetchUrl, {
		method: 'GET',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}

// change password
export const changePassword = (companyId, token, oldPassword, newPassword) => {
	this.fetchUrl = api.domainUrl + api.changePassword + api.oldPassword + oldPassword + api.newPassword + newPassword;
	return fetch(this.fetchUrl, {
		method: 'POST',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}

// get pending orders ( delivery ) 
export const getPendingOrders = (companyId, token) => {
	this.fetchUrl = api.domainUrl + api.pendingOrders; 
	return fetch(this.fetchUrl, {
		method: 'GET',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}

// get history orders ( history ) 
export const getHistoryOrders = (companyId, token) => {
	this.fetchUrl = api.domainUrl + api.historyOrders;
	return fetch(this.fetchUrl, {
		method: 'GET',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}

// get order info ( order details ) 
export const getOrderInfo = (companyId, token, orderId) => {
	this.fetchUrl = api.domainUrl + api.orderInfo + api.orderId + orderId;
	return fetch(this.fetchUrl, {
		method: 'GET',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}


// ------------------------------------------------------------------------------------------------------

// cancel delivery
export const cancelDelivery = (companyId, token, orderId, reasonText) => {
	this.fetchUrl = api.domainUrl + api.cancelDelivery;
	const params = {
		OrderId: orderId,
		ReasonText: reasonText
	};
	return fetch(this.fetchUrl, {
		method: 'POST',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(params)
	}).then(processResponse);
}

// postpone delivery
export const postponeDelivery = (companyId, token, orderId, reasonText) => {
	this.fetchUrl = api.domainUrl + api.postponeDelivery;
	const params = {
		OrderId: orderId,
		ReasonText: reasonText
	};
	return fetch(this.fetchUrl, {
		method: 'POST',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(params)
	}).then(processResponse);
}

// post delivery
export const orderDelivery = (companyId, token, acceptorName, acceptorContact, signature, remarks, orderId) => {
	this.fetchUrl = api.domainUrl + api.orderDelivery;
	const params = {
		DeliveryRemarks: remarks,
		OrderId: orderId,
		ReceivedPersonName: acceptorName,
		ReceivedPersonContact: acceptorContact,
		ReceivedPersonSignature: signature,
	};

	return fetch(this.fetchUrl, {
		method: 'POST',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(params)
	}).then(processResponse);
}

// -----------------------------------------------------------------------------------------------------------

// get pickup orders 
export const getPickupOrders = (companyId, token) => {
	this.fetchUrl = api.domainUrl + api.pickupOrders; 
	return fetch(this.fetchUrl, {
		method: 'GET',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}

// cancel pickup
export const cancelPickup = (companyId, token, returnId, reasonText) => {
	this.fetchUrl = api.domainUrl + api.rejectPickup;
	const params = {
		ReturnId: returnId,
		ReasonText: reasonText
	};
	return fetch(this.fetchUrl, {
		method: 'POST',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(params)
	}).then(processResponse);
}

// get return info ( return order details ) 
export const getReturnInfo = (companyId, token, returnId) => {
	this.fetchUrl = api.domainUrl + api.getReturnOrder + returnId;
	return fetch(this.fetchUrl, {
		method: 'GET',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
		},
	}).then(processResponse);
}

// pickupp
export const pickup = (companyId, token, acceptorName, acceptorContact, signature, remarks, returnId) => {
	this.fetchUrl = api.domainUrl + api.pickup;
	const params = {
		returnId: returnId,
		pickupfrom: acceptorName,
		pickupFromContact: acceptorContact,
		pickupFromSignature: signature,
		pickupOrderItems: [
			{
				returnItemId: returnId,
				remarks: remarks
			}
		]
	};

	console.log(params,"oaramss");

	return fetch(this.fetchUrl, {
		method: 'POST',
		headers: {
			'CompanyId': companyId,
			'Authorization' : 'Bearer ' + token,
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(params)
	}).then(processResponse);
}


processResponse = (response) => {
	const statusCode = response.status;
	const data = response.json();
	return Promise.all([statusCode, data]).then(res => ({
		statusCode: res[0],
		data: res[1]
	}));
}