// API

//export const companyidValue = 13;
export const companyidValue = 38;
export const domainUrl = 'https://api.estorelogin.com/';

// login

export const loginUrl = "token";
export const loginUsername = '&username=';
export const loginPassword = '&password=';
export const companyidUrl = '&companyId=';
export const loginType = '&type=catering';
export const loginContentUrl = 'grant_type=password';

// get employee info

export const employeeUrl = "api/Employee/info";

// Change password

export const changePassword = "api/Employee/ChangePassword?";
export const oldPassword = 'oldPassword=';
export const newPassword = '&newPassword=';

// get pending order ( delivery )

export const pendingOrders = "api/Order/PendingOrders";

// get hsitory order 

export const historyOrders = "api/Order/OrderHistory";


// get order info

export const orderInfo = "api/Order/Info?";
export const orderId = 'orderId=';

// cancel delivery

export const cancelDelivery = "api/Order/Delivery/CancelOrder"; 

//  postpone delivery

export const postponeDelivery = "api/Order/Delivery/PostStatus";

// order delivery

export const orderDelivery = "api/Order/Delivery/DeliverOrder";

// get pickup

export const pickupOrders = "api/ReturnRequest/Pending";

// reject pickup

export const rejectPickup = "api/ReturnRequest/Decline"; 

// pickup delivery

export const pickupDelivery = "api/ReturnRequest/Decline"; 


// get return order

export const getReturnOrder = "api/ReturnRequest/Info?returnId="


// pickup

export const pickup = "api/ReturnRequest/Pickup";