class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :create_guest_if_needed
  
  def create_guest_if_needed
    return if session[:user_id] 
    @user = User.new_guest
    @user.save
    session[:user_id] = @user.id
    # do anything else you need here...
  end

  def set_order
    order = Order.find_by(id: session[:order_id])
    if order
      @current_order = order
    else
      create_order
    end
  end

  def current_order
    @current_order ||= set_order
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
    # if session[:user_id].nil?
    #   user.new_guest
    #   redirect_to review_order_path
    # end
    fail
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
