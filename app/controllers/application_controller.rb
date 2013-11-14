class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def set_order
    order = Order.find_by(id: session[:order_id])
    if order
      @current_order = order
    else
      create_order
    end
  end

  def to_currency(value)
    ActionController::Base.helpers.number_to_currency(value)
  end

  def create_order
    @current_order = Order.create(status: "pending")
    session[:order_id] = @current_order.id
    @current_user
  end

  def current_user
    @current_user ||= lookup_user
  end

  def lookup_user
    if session[:user_id]
      User.find_by(id: session[:user_id]) || session[:user_id] = nil
    end
  end

  def validate_order
    @amount = set_order.subtotal
    if session[:user_id] && @amount == 0
      flash.now[:error] = ["Please add items to your order before proceeding."]
      redirect_to menu_path
    end
    if session[:user_id].nil?
      flash.now[:error] = ["You must login or sign up before paying."]
      redirect_to menu_path

    end
    fail
  end



  before_filter :authorize

  delegate :allow?, to: :current_permission
  helper_method :allow?

  private

  def current_permission
    @current_permission ||= Permission.new(current_user)
  end

  def authorize
    if !current_permission.allow?(params[:controller], params[:action])
      redirect_to items_path, alert: "Not authorized."
    end
  end

end
