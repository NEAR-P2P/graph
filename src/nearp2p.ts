import { near, JSONValue, json, ipfs, log, TypedMap, Value, typeConversion, BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import { Datauser, Paymentmethod, Fiatmethod, Paymentmethoduser, Offersbuy, Offerssell, Orderbuy, Ordersell, Orderhistorybuy, Orderhistorysell } from "../generated/schema"
//import { JSON } from "json-as"

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.outcome,
      receipt.block.header
    );
  }
}

//const list_contract_atributos_referencia = [];


function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  outcome: near.ExecutionOutcome,
  blockHeader: near.BlockHeader
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) return;

  const methodName = action.toFunctionCall().methodName;

  /*let outcomeLogs = ""
  if (outcome.logs.length > 0) {
    outcomeLogs = outcome.logs[0].toString()
  }
  log.info('-----------methodo: {} - outcomeLog {}', [methodName, outcomeLogs])
  */
//  if (outcome.logs.length == 0) return

  if (methodName == 'set_user' || methodName == 'set_user_admin') {

    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();

      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
        
        const user_id = data.get('user_id')
        const name = data.get('name')
        const last_name = data.get('last_name')
        const phone = data.get('phone')
        const email = data.get('email')
        const country = data.get('country')
        const mediator = data.get('mediator')
        const is_active = data.get('is_active')
        const badge = data.get('badge')
        const is_merchant = data.get('is_merchant')
        const campo1 = data.get('campo1')
        const campo2 = data.get('campo2')
        const campo3 = data.get('campo3')

        if (!user_id || !name || !last_name || !phone || !email || !country || !mediator || !is_active || !badge || !is_merchant || !campo1 || !campo2 || !campo3) return
        
        const id = user_id.toString()
        let users = Datauser.load(id)
        if (!users) {
          users = new Datauser(id)
          users.user_id = user_id.toString()
          users.name = name.toString()
          users.last_name = last_name.toString()
          users.phone = phone.toString()
          users.email = email.toString()
          users.country = country.toString()
          users.mediator = mediator.toBool()
          users.is_active = is_active.toBool()
          users.badge = badge.toString()
          users.is_merchant = is_merchant.toBool()
          users.campo1 = campo1.toString()
          users.campo2 = campo2.toString()
          users.campo3 = campo3.toString()
          users.total_orders = 0
          users.orders_completed = 0
          users.percentaje_completion = "0"
          users.save()
        }
        
      }
    }
  }

  if (methodName == 'put_user' || methodName == 'put_users') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
        
        const user_id = data.get('user_id')
        const name = data.get('name')
        const last_name = data.get('last_name')
        const phone = data.get('phone')
        const email = data.get('email')
        const country = data.get('country')
        const mediator = data.get('mediator')
        const is_active = data.get('is_active')
      

        if (!user_id || !name || !last_name || !phone || !email || !country || !mediator || !is_active) return
        
        const id = user_id.toString()
        let users = Datauser.load(id)
        if (users) {
          users.user_id = user_id.toString()
          users.name = name.toString()
          users.last_name = last_name.toString()
          users.phone = phone.toString()
          users.email = email.toString()
          users.country = country.toString()
          users.mediator = mediator.toBool()
          users.is_active = is_active.toBool()
          users.save()
        }
        
      }
    }
  }

  if (methodName == 'put_merchant') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
        
        const user_id = data.get('user_id')
        const badge = data.get('badge')
        const is_merchant = data.get('is_merchant')
        const total_orders = data.get('total_orders')
        const orders_completed = data.get('orders_completed')
        const percentaje_completion = data.get('percentaje_completion')

        if (!user_id || !badge || !is_merchant || !total_orders || !orders_completed || !percentaje_completion) return
        
        const id = user_id.toString()
        let users = Datauser.load(id)
        if (users) {
          users.user_id = user_id.toString()
          users.badge = badge.toString()
          users.is_merchant = is_merchant.toBool()
          users.total_orders = parseInt(total_orders.toString()) as i32
          users.orders_completed = parseInt(orders_completed.toString()) as i32
          users.percentaje_completion = percentaje_completion.toString()
          users.save()
        }
        
      }
    }
  }
  

  if (methodName == 'set_payment_method' || methodName == 'put_payment_method') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const method_id = data.get('id')
        const payment_method = data.get('payment_method')
        const input1 = data.get('input1')
        const input2 = data.get('input2')
        const input3 = data.get('input3')
        const input4 = data.get('input4')
        const input5 = data.get('input5')

        if (!method_id || !payment_method || !input1 || !input2 || !input3 || !input4 || !input5) return
        
        const id = method_id.toString()
        let paymentMethods = Paymentmethod.load(id)
        if (!paymentMethods) {
          paymentMethods = new Paymentmethod(id)
          //paymentMethods.paymentmethoduser = id
        }
        paymentMethods.payment_method = payment_method.toString()
        paymentMethods.input1 = input1.toString()
        paymentMethods.input2 = input2.toString()
        paymentMethods.input3 = input3.toString()
        paymentMethods.input4 = input4.toString()
        paymentMethods.input5 = input5.toString()
        
        paymentMethods.save()
        
      }
    }
  } 

  if (methodName == 'set_fiat_method' || methodName == 'put_fiat_method') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
        
        const method_id = data.get('id')
        const fiat_method = data.get('fiat_method')
        const flagcdn = data.get('flagcdn')

        if (!method_id || !flagcdn || !fiat_method) return
        
        const id = method_id.toString()
        let fiatMethods = Fiatmethod.load(id)
        if (!fiatMethods) {
          fiatMethods = new Fiatmethod(id)
        }

        fiatMethods.flagcdn = flagcdn.toString()
        fiatMethods.fiat_method = fiat_method.toString()
        fiatMethods.save()
        
      }
    }
  }


  if (methodName == 'delete_fiat_method') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const method_id = data.get('id')

        if (!method_id) return
        
        const id = method_id.toString()
        let fiatMethods = Fiatmethod.load(id)
        if (fiatMethods) {
          fiatMethods.delete()
        }
      }
    }
  }

  if (methodName == 'set_payment_method_user' || methodName == 'set_payment_method_user_admin') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const user_id = data.get('user_id')
        const payment_method = data.get('payment_method_id')
        const input1 = data.get('input1')
        const input2 = data.get('input2')
        const input3 = data.get('input3')
        const input4 = data.get('input4')
        const input5 = data.get('input5')

        if (!user_id || !payment_method || !input1 || !input2 || !input3 || !input4 || !input5) return
        
        const id = user_id.toString() + "|" + payment_method.toString()
        let paymentMethodUsers = Paymentmethoduser.load(id)
        if (!paymentMethodUsers) {
          paymentMethodUsers = new Paymentmethoduser(id)
        }
        paymentMethodUsers.user_id = user_id.toString()
        paymentMethodUsers.payment_method = payment_method.toString()
        paymentMethodUsers.input1 = input1.toString()
        paymentMethodUsers.input2 = input2.toString()
        paymentMethodUsers.input3 = input3.toString()
        paymentMethodUsers.input4 = input4.toString()
        paymentMethodUsers.input5 = input5.toString()
        
        paymentMethodUsers.save()
        
      }
    }
  }

  if (methodName == 'put_payment_method_user') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const user_id = data.get('user_id')
        const payment_method = data.get('payment_method_id')
        const input1 = data.get('input1')
        const input2 = data.get('input2')
        const input3 = data.get('input3')
        const input4 = data.get('input4')
        const input5 = data.get('input5')

        if (!user_id || !payment_method || !input1 || !input2 || !input3 || !input4 || !input5) return
        
        const id = user_id.toString() + "|" + payment_method.toString()
        let paymentMethodUsers = Paymentmethoduser.load(id)
        if (paymentMethodUsers) {
          paymentMethodUsers.user_id = user_id.toString()
          paymentMethodUsers.payment_method = payment_method.toString()
          paymentMethodUsers.input1 = input1.toString()
          paymentMethodUsers.input2 = input2.toString()
          paymentMethodUsers.input3 = input3.toString()
          paymentMethodUsers.input4 = input4.toString()
          paymentMethodUsers.input5 = input5.toString()
          
          paymentMethodUsers.save()
        }
      }
    }
  }

  if (methodName == 'delete_payment_method_user') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const user_id = data.get('user_id')
        const payment_method = data.get('payment_method_id')

        if (!user_id || !payment_method) return
        
        const id = user_id.toString() + "|" + payment_method.toString()
        let paymentMethodUsers = Paymentmethoduser.load(id)
        if (paymentMethodUsers) {
          paymentMethodUsers.delete()
        }
      }
    }
  }

  //agregar ofertas de compra
  if (methodName == 'on_set_offers_buy') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const offer_id = data.get('offer_id')
        const owner_id = data.get('owner_id')
        const asset = data.get('asset')
        const exchange_rate = data.get('exchange_rate')
        const amount = data.get('amount')
        const remaining_amount = data.get('remaining_amount')
        const min_limit = data.get('min_limit')
        const max_limit = data.get('max_limit')
        const payment_method = data.get('payment_method')
        const fiat_method = data.get('fiat_method')
        const is_merchant = data.get('is_merchant')
        const time = data.get('time')
        const terms_conditions = data.get('terms_conditions')
        const status = data.get('status')

        if (!offer_id || !owner_id || !asset || !exchange_rate || !amount || !remaining_amount || !min_limit || !max_limit || !payment_method || !fiat_method || !is_merchant 
            || !time || !terms_conditions || !status) return
        
        const id = offer_id.toString()
        let offersbuy = Offersbuy.load(id)
        if (!offersbuy) {
          let paymentmethod = ''
          const payment_method_array = payment_method.toArray()
          for(let i = 0; i < payment_method_array.length; i++) { 
            if(i == 0) paymentmethod = paymentmethod + '['
            let id = payment_method_array[i].toObject().get("id") 
            let pm = payment_method_array[i].toObject().get("payment_method") 
            if(!id || !pm) return
            paymentmethod = paymentmethod + '{"id": ' + id.toString() + ', "payment_method": ' + pm.toString() + '}'
            if(i != payment_method_array.length - 1) {
              paymentmethod = paymentmethod + ','
            } else {
              paymentmethod = paymentmethod + ']'
            }
          }
          offersbuy = new Offersbuy(id)
          offersbuy.offer_id = BigInt.fromString(offer_id.toString())
          offersbuy.owner_id = owner_id.toString()
          offersbuy.asset = asset.toString()
          offersbuy.exchange_rate = exchange_rate.toString()
          offersbuy.amount = BigInt.fromString(amount.toString())
          offersbuy.remaining_amount = BigInt.fromString(remaining_amount.toString())
          offersbuy.min_limit = BigInt.fromString(min_limit.toString())
          offersbuy.max_limit = BigInt.fromString(max_limit.toString())
          offersbuy.payment_method =  paymentmethod
          offersbuy.fiat_method = BigInt.fromString(fiat_method.toString())
          offersbuy.is_merchant = is_merchant.toBool()
          offersbuy.time = BigInt.fromString(time.toString())
          offersbuy.terms_conditions = terms_conditions.toString()
          offersbuy.status =  parseInt(status.toString()) as i32
          
          offersbuy.save()
        }
      }
    }
  }

  //eliminar ofertas de compra
  if (methodName == 'on_delete_offers_buy') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const offer_id = data.get('offer_id')

        if (!offer_id) return
        
        const id = offer_id.toString()
        let offersbuy = Offersbuy.load(id)
        if (offersbuy) {
          offersbuy.delete()
        }
      }
    }
  }

  // agregar ofertas de venta
  if (methodName == 'set_offers_sell') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const offer_id = data.get('offer_id')
        const owner_id = data.get('owner_id')
        const asset = data.get('asset')
        const exchange_rate = data.get('exchange_rate')
        const amount = data.get('amount')
        const remaining_amount = data.get('remaining_amount')
        const min_limit = data.get('min_limit')
        const max_limit = data.get('max_limit')
        const payment_method = data.get('payment_method')
        const fiat_method = data.get('fiat_method')
        const is_merchant = data.get('is_merchant')
        const time = data.get('time')
        const terms_conditions = data.get('terms_conditions')
        const status = data.get('status')

        if (!offer_id || !owner_id || !asset || !exchange_rate || !amount || !remaining_amount || !min_limit || !max_limit || !payment_method || !fiat_method || !is_merchant 
            || !time || !terms_conditions || !status) return
        
        const id = offer_id.toString()
        let offerssell = Offerssell.load(id)
        if (!offerssell) {
          let paymentmethod = ''
          const payment_method_array = payment_method.toArray()
          for(let i = 0; i < payment_method_array.length; i++) { 
            if(i == 0) paymentmethod = paymentmethod + '['
            let id = payment_method_array[i].toObject().get("id") 
            let pm = payment_method_array[i].toObject().get("payment_method") 
            if(!id || !pm) return
            paymentmethod = paymentmethod + '{"id": ' + id.toString() + ', "payment_method": ' + pm.toString() + '}'
            if(i != payment_method_array.length - 1) {
              paymentmethod = paymentmethod + ','
            } else {
              paymentmethod = paymentmethod + ']'
            }
          }
          offerssell = new Offerssell(id)
          offerssell.offer_id = BigInt.fromString(offer_id.toString())
          offerssell.owner_id = owner_id.toString()
          offerssell.asset = asset.toString()
          offerssell.exchange_rate = exchange_rate.toString()
          offerssell.amount = BigInt.fromString(amount.toString())
          offerssell.remaining_amount = BigInt.fromString(remaining_amount.toString())
          offerssell.min_limit = BigInt.fromString(min_limit.toString())
          offerssell.max_limit = BigInt.fromString(max_limit.toString())
          offerssell.payment_method = paymentmethod
          offerssell.fiat_method = BigInt.fromString(fiat_method.toString())
          offerssell.is_merchant = is_merchant.toBool()
          offerssell.time = BigInt.fromString(time.toString())
          offerssell.terms_conditions = terms_conditions.toString()
          offerssell.status =  parseInt(status.toString()) as i32
          
          offerssell.save()
        }
        
      }
    }
  }

  //eliminar ofertas de venta
  if (methodName == 'delete_offers_sell') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const offer_id = data.get('offer_id')

        if (!offer_id) return
        
        const id = offer_id.toString()
        let offerssell = Offerssell.load(id)
        if (offerssell) {
          offerssell.delete()
        }
      }
    }
  }

  //agregar ordenes de compra
  if (methodName == 'accept_offer') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const offer_id = data.get('offer_id')
        const order_id = data.get('order_id')
        const owner_id = data.get('owner_id')
        const asset = data.get('asset')
        const signer_id = data.get('signer_id')
        const exchange_rate = data.get('exchange_rate')
        const operation_amount = data.get('operation_amount')
        const amount_delivered = data.get('amount_delivered')
        const fee_deducted = data.get('fee_deducted')
        const payment_method = data.get('payment_method')
        const fiat_method = data.get('fiat_method')
        const confirmation_owner_id = data.get('confirmation_owner_id')
        const confirmation_signer_id = data.get('confirmation_signer_id')
        const confirmation_current = data.get('confirmation_current')
        const time = data.get('time')
        const datetime = data.get('datetime')
        const terms_conditions = data.get('terms_conditions')
        const status = data.get('status')

        if (!offer_id || !order_id || !owner_id || !asset || !signer_id || !exchange_rate || !operation_amount || !amount_delivered || !fee_deducted 
          || !payment_method || !fiat_method || !confirmation_owner_id || !confirmation_signer_id || !confirmation_current || !time || !datetime 
          || !terms_conditions || !status) return
        
        const id = order_id.toString()
        let orderbuy = Orderbuy.load(id)
        if (!orderbuy) {
          orderbuy = new Orderbuy(id)
          orderbuy.offer_id = BigInt.fromString(offer_id.toString())
          orderbuy.order_id = BigInt.fromString(order_id.toString())
          orderbuy.owner_id = owner_id.toString()
          orderbuy.asset = asset.toString()
          orderbuy.signer_id = signer_id.toString()
          orderbuy.exchange_rate = exchange_rate.toString()
          orderbuy.operation_amount = BigInt.fromString(operation_amount.toString())
          orderbuy.amount_delivered = BigInt.fromString(amount_delivered.toString())
          orderbuy.fee_deducted = BigInt.fromString(fee_deducted.toString())
          orderbuy.payment_method = BigInt.fromString(payment_method.toString())
          orderbuy.fiat_method = BigInt.fromString(fiat_method.toString())
          orderbuy.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
          orderbuy.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
          orderbuy.confirmation_current = parseInt(confirmation_current.toString()) as i32
          orderbuy.time = BigInt.fromString(time.toString())
          orderbuy.datetime = datetime.toString()
          orderbuy.terms_conditions = terms_conditions.toString()
          orderbuy.status =  parseInt(status.toString()) as i32
          
          orderbuy.save()

          let datauser_owner = Datauser.load(owner_id.toString())
          if(datauser_owner) {
            datauser_owner.total_orders = datauser_owner.total_orders + 1
            datauser_owner.percentaje_completion = ((datauser_owner.orders_completed / datauser_owner.total_orders) * 100).toString()
            datauser_owner.save()
          }
          let datauser_signer = Datauser.load(signer_id.toString())
          if(datauser_signer) {
            datauser_signer.total_orders = datauser_signer.total_orders + 1
            datauser_signer.percentaje_completion = ((datauser_signer.orders_completed / datauser_signer.total_orders) * 100).toString()
            datauser_signer.save()
          }
        }
        
      }
    }
  }

  //agregar ordenes de venta
  if (methodName == 'on_accept_offer_sell') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();
    
        const offer_id = data.get('offer_id')
        const order_id = data.get('order_id')
        const owner_id = data.get('owner_id')
        const asset = data.get('asset')
        const signer_id = data.get('signer_id')
        const exchange_rate = data.get('exchange_rate')
        const operation_amount = data.get('operation_amount')
        const amount_delivered = data.get('amount_delivered')
        const fee_deducted = data.get('fee_deducted')
        const payment_method = data.get('payment_method')
        const fiat_method = data.get('fiat_method')
        const confirmation_owner_id = data.get('confirmation_owner_id')
        const confirmation_signer_id = data.get('confirmation_signer_id')
        const confirmation_current = data.get('confirmation_current')
        const time = data.get('time')
        const datetime = data.get('datetime')
        const terms_conditions = data.get('terms_conditions')
        const status = data.get('status')

        if (!offer_id || !order_id || !owner_id || !asset || !signer_id || !exchange_rate || !operation_amount || !amount_delivered || !fee_deducted 
          || !payment_method || !fiat_method || !confirmation_owner_id || !confirmation_signer_id || !confirmation_current || !time || !datetime 
          || !terms_conditions || !status) return
        
        const id = order_id.toString()
        let ordersell = Ordersell.load(id)
        if (!ordersell) {
          ordersell = new Ordersell(id)
          ordersell.offer_id = BigInt.fromString(offer_id.toString())
          ordersell.order_id = BigInt.fromString(order_id.toString())
          ordersell.owner_id = owner_id.toString()
          ordersell.asset = asset.toString()
          ordersell.signer_id = signer_id.toString()
          ordersell.exchange_rate = exchange_rate.toString()
          ordersell.operation_amount = BigInt.fromString(operation_amount.toString())
          ordersell.amount_delivered = BigInt.fromString(amount_delivered.toString())
          ordersell.fee_deducted = BigInt.fromString(fee_deducted.toString())
          ordersell.payment_method = BigInt.fromString(payment_method.toString())
          ordersell.fiat_method = BigInt.fromString(fiat_method.toString())
          ordersell.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
          ordersell.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
          ordersell.confirmation_current = parseInt(confirmation_current.toString()) as i32
          ordersell.time = BigInt.fromString(time.toString())
          ordersell.datetime = datetime.toString()
          ordersell.terms_conditions = terms_conditions.toString()
          ordersell.status =  parseInt(status.toString()) as i32
          
          ordersell.save()
          
          let datauser_owner = Datauser.load(owner_id.toString())
          if(datauser_owner) {
            datauser_owner.total_orders = datauser_owner.total_orders + 1
            datauser_owner.percentaje_completion = ((datauser_owner.orders_completed / datauser_owner.total_orders) * 100).toString()
            datauser_owner.save()
          }
          let datauser_signer = Datauser.load(signer_id.toString())
          if(datauser_signer) {
            datauser_signer.total_orders = datauser_signer.total_orders + 1
            datauser_signer.percentaje_completion = ((datauser_signer.orders_completed / datauser_signer.total_orders) * 100).toString()
            datauser_signer.save()
          }

        }

        
      }
    }
  }


  //agregar ordenes de venta
  if (methodName == 'order_confirmation') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();

        const order_id = data.get('order_id')
        const offer_type = data.get('offer_type')
        const status = data.get('status')

        if (!order_id || !offer_type || !status) return
        
        if(offer_type.toString() == "1") {
          const confirmation_owner_id = data.get('confirmation_owner_id')
          if (!confirmation_owner_id) return
          const id = order_id.toString()
          let ordersell = Ordersell.load(id)
          if (ordersell) {
            ordersell.order_id = BigInt.fromString(order_id.toString())
            ordersell.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
            ordersell.status =  parseInt(status.toString()) as i32
            ordersell.save()
          }
        }
        if(offer_type.toString() == "2") {
          const confirmation_signer_id = data.get('confirmation_signer_id')
          if (!confirmation_signer_id) return
          const id = order_id.toString()
          let orderbuy = Orderbuy.load(id)
          if (orderbuy) {
            orderbuy.order_id = BigInt.fromString(order_id.toString())
            orderbuy.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
            orderbuy.status =  parseInt(status.toString()) as i32
            orderbuy.save()
          }
        }
        
      }
    }
  }


  //agregar ordenes de venta
  if (methodName == 'cancel_order') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();

        const order_id = data.get('order_id')
        const offer_type = data.get('offer_type')
        const status = data.get('status')

        if (!order_id || !offer_type || !status) return
        
        if(offer_type.toString() == "1") {
          const confirmation_signer_id = data.get('confirmation_signer_id')
          if (!confirmation_signer_id) return
          const id = order_id.toString()
          let ordersell = Ordersell.load(id)
          if (ordersell) {
            ordersell.order_id = BigInt.fromString(order_id.toString())
            ordersell.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
            ordersell.status =  parseInt(status.toString()) as i32
            ordersell.save()
          }
        }
        if(offer_type.toString() == "2") {
          const confirmation_owner_id = data.get('confirmation_owner_id')
          if (!confirmation_owner_id) return
          const id = order_id.toString()
          let orderbuy = Orderbuy.load(id)
          if (orderbuy) {
            orderbuy.order_id = BigInt.fromString(order_id.toString())
            orderbuy.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
            orderbuy.status =  parseInt(status.toString()) as i32
            orderbuy.save()
          }
        }
        
      }
    }
  }

  //agregar ordenes de venta
  if (methodName == 'order_dispute') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();

        const type = jsonObject.get('type');
        const order_id = data.get('order_id')
        const offer_type = data.get('offer_type')
        const status = data.get('status')

        if (!type || !order_id || !offer_type || !status) return
        
        if(offer_type.toString() == "1") {
          if(type.toString() == "order_dispute_owner") {
            const confirmation_owner_id = data.get('confirmation_owner_id')
            if (!confirmation_owner_id) return
            const id = order_id.toString()
            let ordersell = Ordersell.load(id)
            if (ordersell) {
              ordersell.order_id = BigInt.fromString(order_id.toString())
              ordersell.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
              ordersell.status =  parseInt(status.toString()) as i32
              ordersell.save()
            }
          } else if(type.toString() == "order_dispute_signer") {
            const confirmation_signer_id = data.get('confirmation_signer_id')
            if (!confirmation_signer_id) return
            const id = order_id.toString()
            let ordersell = Ordersell.load(id)
            if (ordersell) {
              ordersell.order_id = BigInt.fromString(order_id.toString())
              ordersell.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
              ordersell.status =  parseInt(status.toString()) as i32
              ordersell.save()
            }
          }
        } else if(offer_type.toString() == "2") {
          if(type.toString() == "order_dispute_owner") {
            const confirmation_owner_id = data.get('confirmation_owner_id')
            if (!confirmation_owner_id) return
            const id = order_id.toString()
            let orderbuy = Orderbuy.load(id)
            if (orderbuy) {
              orderbuy.order_id = BigInt.fromString(order_id.toString())
              orderbuy.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
              orderbuy.status =  parseInt(status.toString()) as i32
              orderbuy.save()
            }
          } else if(type.toString() == "order_dispute_signer") {
            const confirmation_signer_id = data.get('confirmation_signer_id')
            if (!confirmation_signer_id) return
            const id = order_id.toString()
            let orderbuy = Orderbuy.load(id)
            if (orderbuy) {
              orderbuy.order_id = BigInt.fromString(order_id.toString())
              orderbuy.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
              orderbuy.status =  parseInt(status.toString()) as i32
              orderbuy.save()
            }
          }
        }
      }
    }
  }



  //agregar ordenes de venta
  if (methodName == 'on_confirmation') {
    //for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    if(outcome.logs.length > 0) {
      const outcomeLog = outcome.logs[0].toString();
      
      if(!json.try_fromString(outcomeLog).isOk) return
      let outcomelogs = json.try_fromString(outcomeLog);
      const jsonObject = outcomelogs.value.toObject();
      
      if (jsonObject) {
        const logJson = jsonObject.get('params');
        if (!logJson) return;
        const data = logJson.toObject();

        const type = jsonObject.get('type');
        const offer_id = data.get('offer_id')
        const order_id = data.get('order_id')
        const owner_id = data.get('owner_id')
        const asset = data.get('asset')
        const signer_id = data.get('signer_id')
        const exchange_rate = data.get('exchange_rate')
        const operation_amount = data.get('operation_amount')
        const amount_delivered = data.get('amount_delivered')
        const fee_deducted = data.get('fee_deducted')
        const payment_method = data.get('payment_method')
        const fiat_method = data.get('fiat_method')
        const confirmation_owner_id = data.get('confirmation_owner_id')
        const confirmation_signer_id = data.get('confirmation_signer_id')
        const confirmation_current = data.get('confirmation_current')
        const time = data.get('time')
        const datetime = data.get('datetime')
        const terms_conditions = data.get('terms_conditions')
        const status = data.get('status')
        const confirmacion = data.get('confirmacion')

        if (!type || !offer_id || !order_id || !owner_id || !asset || !signer_id || !exchange_rate || !operation_amount || !amount_delivered || !fee_deducted 
          || !payment_method || !fiat_method || !confirmation_owner_id || !confirmation_signer_id || !confirmation_current || !time || !datetime 
          || !terms_conditions || !status || !confirmacion) return
        
        if(type.toString() == "on_confirmation_sell") {
          const id = order_id.toString()
          let ordersell = Ordersell.load(id)
          if (ordersell) {
            if(confirmacion.toBool()) {
              let orderhistorysell = Orderhistorysell.load(id)
              if(!orderhistorysell) {
                orderhistorysell = new Orderhistorysell(id)
                orderhistorysell.offer_id = BigInt.fromString(offer_id.toString())
                orderhistorysell.order_id = BigInt.fromString(order_id.toString())
                orderhistorysell.owner_id = owner_id.toString()
                orderhistorysell.asset = asset.toString()
                orderhistorysell.signer_id = signer_id.toString()
                orderhistorysell.exchange_rate = exchange_rate.toString()
                orderhistorysell.operation_amount = BigInt.fromString(operation_amount.toString())
                orderhistorysell.amount_delivered = BigInt.fromString(amount_delivered.toString())
                orderhistorysell.fee_deducted = BigInt.fromString(fee_deducted.toString())
                orderhistorysell.payment_method = BigInt.fromString(payment_method.toString())
                orderhistorysell.fiat_method = BigInt.fromString(fiat_method.toString())
                orderhistorysell.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
                orderhistorysell.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
                orderhistorysell.confirmation_current = parseInt(confirmation_current.toString()) as i32
                orderhistorysell.time = BigInt.fromString(time.toString())
                orderhistorysell.datetime = datetime.toString()
                orderhistorysell.terms_conditions = terms_conditions.toString()
                orderhistorysell.status =  parseInt(status.toString()) as i32
                
                orderhistorysell.save()  
              }

              ordersell.delete()

              let datauser_owner = Datauser.load(owner_id.toString())
              if(datauser_owner) {
                datauser_owner.orders_completed = datauser_owner.orders_completed + 1
                datauser_owner.percentaje_completion = ((datauser_owner.orders_completed / datauser_owner.total_orders) * 100).toString()
                datauser_owner.save()
              }
              let datauser_signer = Datauser.load(signer_id.toString())
              if(datauser_signer) {
                datauser_signer.orders_completed = datauser_signer.orders_completed + 1
                datauser_signer.percentaje_completion = ((datauser_signer.orders_completed / datauser_signer.total_orders) * 100).toString()
                datauser_signer.save()
              }
            } else {
              ordersell.offer_id = BigInt.fromString(offer_id.toString())
              ordersell.order_id = BigInt.fromString(order_id.toString())
              ordersell.owner_id = owner_id.toString()
              ordersell.asset = asset.toString()
              ordersell.signer_id = signer_id.toString()
              ordersell.exchange_rate = exchange_rate.toString()
              ordersell.operation_amount = BigInt.fromString(operation_amount.toString())
              ordersell.amount_delivered = BigInt.fromString(amount_delivered.toString())
              ordersell.fee_deducted = BigInt.fromString(fee_deducted.toString())
              ordersell.payment_method = BigInt.fromString(payment_method.toString())
              ordersell.fiat_method = BigInt.fromString(fiat_method.toString())
              ordersell.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
              ordersell.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
              ordersell.confirmation_current = parseInt(confirmation_current.toString()) as i32
              ordersell.time = BigInt.fromString(time.toString())
              ordersell.datetime = datetime.toString()
              ordersell.terms_conditions = terms_conditions.toString()
              ordersell.status =  parseInt(status.toString()) as i32
              
              ordersell.save()
            }
          }

        } else if(type.toString() == "on_confirmation_buy") {
          const id = order_id.toString()
          let orderbuy = Orderbuy.load(id)
          if (orderbuy) {
            if(confirmacion.toBool()) {
              let orderhistorybuy = Orderhistorybuy.load(id)
              if(!orderhistorybuy) {
                orderhistorybuy = new Orderhistorybuy(id)
                orderhistorybuy.offer_id = BigInt.fromString(offer_id.toString())
                orderhistorybuy.order_id = BigInt.fromString(order_id.toString())
                orderhistorybuy.owner_id = owner_id.toString()
                orderhistorybuy.asset = asset.toString()
                orderhistorybuy.signer_id = signer_id.toString()
                orderhistorybuy.exchange_rate = exchange_rate.toString()
                orderhistorybuy.operation_amount = BigInt.fromString(operation_amount.toString())
                orderhistorybuy.amount_delivered = BigInt.fromString(amount_delivered.toString())
                orderhistorybuy.fee_deducted = BigInt.fromString(fee_deducted.toString())
                orderhistorybuy.payment_method = BigInt.fromString(payment_method.toString())
                orderhistorybuy.fiat_method = BigInt.fromString(fiat_method.toString())
                orderhistorybuy.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
                orderhistorybuy.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
                orderhistorybuy.confirmation_current = parseInt(confirmation_current.toString()) as i32
                orderhistorybuy.time = BigInt.fromString(time.toString())
                orderhistorybuy.datetime = datetime.toString()
                orderhistorybuy.terms_conditions = terms_conditions.toString()
                orderhistorybuy.status =  parseInt(status.toString()) as i32
                
                orderhistorybuy.save()  
              }

              orderbuy.delete()

              let datauser_owner = Datauser.load(owner_id.toString())
              if(datauser_owner) {
                datauser_owner.orders_completed = datauser_owner.orders_completed + 1
                datauser_owner.percentaje_completion = ((datauser_owner.orders_completed / datauser_owner.total_orders) * 100).toString()
                datauser_owner.save()
              }
              let datauser_signer = Datauser.load(signer_id.toString())
              if(datauser_signer) {
                datauser_signer.orders_completed = datauser_signer.orders_completed + 1
                datauser_signer.percentaje_completion = ((datauser_signer.orders_completed / datauser_signer.total_orders) * 100).toString()
                datauser_signer.save()
              }
            } else {
              orderbuy.offer_id = BigInt.fromString(offer_id.toString())
              orderbuy.order_id = BigInt.fromString(order_id.toString())
              orderbuy.owner_id = owner_id.toString()
              orderbuy.asset = asset.toString()
              orderbuy.signer_id = signer_id.toString()
              orderbuy.exchange_rate = exchange_rate.toString()
              orderbuy.operation_amount = BigInt.fromString(operation_amount.toString())
              orderbuy.amount_delivered = BigInt.fromString(amount_delivered.toString())
              orderbuy.fee_deducted = BigInt.fromString(fee_deducted.toString())
              orderbuy.payment_method = BigInt.fromString(payment_method.toString())
              orderbuy.fiat_method = BigInt.fromString(fiat_method.toString())
              orderbuy.confirmation_owner_id = parseInt(confirmation_owner_id.toString()) as i32
              orderbuy.confirmation_signer_id = parseInt(confirmation_signer_id.toString()) as i32
              orderbuy.confirmation_current = parseInt(confirmation_current.toString()) as i32
              orderbuy.time = BigInt.fromString(time.toString())
              orderbuy.datetime = datetime.toString()
              orderbuy.terms_conditions = terms_conditions.toString()
              orderbuy.status =  parseInt(status.toString()) as i32
              
              orderbuy.save()
            }
          }

        }

        
      }
    }
  }

}