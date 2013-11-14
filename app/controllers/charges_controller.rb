class ChargesController < ApplicationController

  before_action :validate_order

  def validate_order
    @amount = set_order.subtotal
    if @amount == 0
      flash[:error] = ["Please add items to your order before proceeding."]
      redirect_to menu_path
    elsif session[:user_id].nil?
      flash[:error] = ["You must login or sign up before paying."]
      redirect_to menu_path
    end
  end

  def new
    @order_number = set_order.id
  end

  def create

    # Amount in cents
    @amount = (set_order.subtotal*100).to_i

    customer = Stripe::Customer.create(
      :email => current_user.email,
      :card  => params[:stripeToken]
    )

    charge = Stripe::Charge.create(
      :customer    => customer.id,
      :amount      => @amount,
      :description => 'What The Pho customer',
      :currency    => 'usd'
    )

    flash[:successful_transaction] = "Thank you! Your order number is '#{set_order.id}.' A receipt was sent to #{customer.email}. We'll email you when your order is completed."
    @current_order.update(status: "paid")
    session[:order_id] = nil
    redirect_to menu_path

  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to menu_path
  end
end
