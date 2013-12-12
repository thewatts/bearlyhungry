class ChargesController < ApplicationController

  before_action :validate_order

  def new
    @order_number = current_order.id
    @amount = current_order.subtotal
  end

  def create
    customer = Stripe::Customer.create(
      :email => current_user.email,
      :card  => params[:stripeToken]
    )
    charge = Stripe::Charge.create(
      :customer    => customer.id,
      :amount      => (current_order.subtotal * 100).to_i,
      :description => 'BearyHungry customer',
      :currency    => 'usd'
    )

    flash[:successful_transaction] = "Thanks! You paid $#{current_order.subtotal}.
    Your order number is '#{current_order.id}.' A receipt was sent to #{customer.email}. We'll email or text you when your order is completed."

    current_order.update_status("paid")
    current_order.send_customer_confirmation_sms
    current_order.send_owner_submitted_sms
    session[:order_id] = nil
    redirect_to menu_path

  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to menu_path
    current_order.update_status("cancelled")
  end

  private

  def validate_order
    if current_order.order_items.count == 0
      flash[:error] = ["Please add items to your order before proceeding."]
      redirect_to menu_path
    end
  end
end
