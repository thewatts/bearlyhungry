class ChargesController < ApplicationController

  before_action :validate_order

  def new
    @order_number = current_order.id
    @amount = current_order.subtotal
  end

  def create_guest
    if params[:email] && params[:password]
      email = params[:email]
      password = params[:password]
      login(email,password, remember_me = false)
    else
      email = params[:email]
      password = SecureRandom.hex(4)
      password_confirmation = password
      first_name = params[:first_name]
      last_name = params[:last_name]
      
      if customer = Customer.create(
        :email => email, 
        :first_name => first_name, 
        :last_name => last_name, 
        :password => password, 
        :password_confirmation => password_confirmation)
      else
        redirect_to :back, notice:"Sorry, that email has already been taken."
      end
      auto_login(customer)
    end
    redirect_to new_charge_path(current_store)
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

    flash[:successful_transaction] = "Thank you! Your order number is '#{current_order.id}.' A receipt was sent to #{customer.email}. We'll email you when your order is completed."
   
    current_order.update(status: "paid")
    session[:order_id] = nil
    redirect_to menu_path

  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to menu_path
  end

  private

  def validate_order
    if current_order.order_items.count == 0
      flash[:error] = ["Please add items to your order before proceeding."]
      redirect_to menu_path
    end
  end
end
