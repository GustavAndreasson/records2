import { connect } from "react-redux"
import { setCurrency, getRate } from "Actions"
import CurrencySelect from "./CurrencySelect.component"

const mapStateToProps = state => ({
  currency: state.collection.currency,
})

const mapDispatchToProps = dispatch => ({
  handleUpdateCurrency: currency => {
    dispatch(setCurrency(currency))
    dispatch(getRate(currency))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySelect)
