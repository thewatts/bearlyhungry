class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_order
  helper_method :current_user

  def set_order
    order = Order.find_by(id: session[:order_id])
    if order
      @current_order = order
    else
      create_order
    end
  end

  def set_guest
    current_user.guest = true
  end

  def current_order
    @current_order ||= set_order
  end

  def to_currency(value)
    ActionController::Base.helpers.number_to_currency(value)
  end

  def create_order
    @current_order = Order.create(status: "pending")
    @current_order.update(user_id: current_user.id) if current_user
    session[:order_id] = @current_order.id
    @current_order
  end

  def current_user
    current_user ||= lookup_user
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
    # if session[:user_id].nil?
    #   user.new_guest
    #   redirect_to review_order_path
    # end
  end

  def assign_current_user_and_update_order_for(user)
    assign_current_user_to(user)
    current_order.add_user(user)
  end

  def assign_current_user_to(user)
    session[:user_id] = user.id
  end

  before_filter :authorize

  delegate :allow?, to: :current_permission
  helper_method :allow?

  private

  def current_permission
    @current_permission ||= Permission.new(current_user)
  end

  def authorize
    unless current_permission.allow?(params[:controller], params[:action])
      redirect_to items_path, alert: "Not authorized."
    end
  end

end
