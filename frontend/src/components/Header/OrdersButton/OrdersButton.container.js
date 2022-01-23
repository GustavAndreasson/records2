import { connect } from "react-redux";
import { showPopup } from "Actions";
import OrdersButton from "./OrdersButton.component";

const mapStateToProps = state => ({
    qtyOrders: state.process.orders.length
});

const mapDispatchToProps = dispatch => ({
    handleShowOrders: () => { dispatch(showPopup("orders")) }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersButton);
