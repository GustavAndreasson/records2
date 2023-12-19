import { connect } from "react-redux"
import { setOrders } from "Actions"
import GridHeader from "./GridHeader.component"

const mapStateToProps = state => ({
  gridHeader: state.ui.GridHeader,
  gridColumns: state.ui.gridColumns,
  currency: state.collection.currency,
  orders: state.process.orders,
})

const mapDispatchToProps = dispatch => ({
  setOrders: orders => {
    dispatch(setOrders(orders))
  },
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  gridHeader: stateProps.gridHeader,
  gridColumns: stateProps.gridColumns,
  currency: stateProps.currency,
  orders: stateProps.orders,
  switchOrder: order =>
    stateProps.orders.some(o => o.attribute === order)
      ? stateProps.orders.find(o => o.attribute === order).reverse
        ? dispatchProps.setOrders(stateProps.orders.filter(o => o.attribute !== order))
        : dispatchProps.setOrders(
            stateProps.orders.map(o =>
              o.attribute == order ? { attribute: order, reverse: true } : o
            )
          )
      : dispatchProps.setOrders([...stateProps.orders, { attribute: order, reverse: false }]),
  ...ownProps,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GridHeader)
