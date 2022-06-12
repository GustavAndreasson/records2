import { connect } from "react-redux"
import { setOrders } from "Actions"
import Orders from "./Orders.component"

const mapStateToProps = state => ({
  orders: state.process.orders,
})

const mapDispatchToProps = dispatch => ({
  handleUpdate: orders => {
    dispatch(setOrders(orders))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Orders)
