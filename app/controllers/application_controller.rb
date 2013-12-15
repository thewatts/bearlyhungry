class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_filter :authorize

  delegate :allow?, to: :current_permission

  helper_method :allow?
  helper_method :current_order
  helper_method :current_user
  helper_method :current_restaurant

  def current_user
    @current_user ||= lookup_user
  end

  def current_order
    if current_order_for_current_restaurant?
      @current_order
    else
      @current_order = set_order if current_restaurant
    end
  end

  def current_order_for_current_restaurant?
    @current_order &&
    current_restaurant &&
    @current_order.restaurant_id == current_restaurant.id
  end

  def current_restaurant
    if current_restaurant_set_and_correct?
      @current_restaurant
    else
      @current_restaurant = restaurant_from_slug
    end
  end

  def current_restaurant_set_and_correct?
    @current_restaurant &&
    params[:slug] &&
    @current_restaurant.slug = params[:slug]
  end

  def restaurant_from_slug
    Restaurant.find_by(:slug => params[:slug])
  end

  def set_guest
    current_user.guest = true
  end

  def to_currency(value)
    ActionController::Base.helpers.number_to_currency(value)
  end

  def validate_order
    if session[:user_id] && current_order.subtotal.zero?
      flash.now[:error] = ["Please add items to your order before proceeding."]
      redirect_to menu_path
    end
  end

  def assign_current_user_and_update_order_for(user)
    assign_current_user_to(user)
    current_order.add_user(user) if current_order
  end

  def assign_current_user_to(user)
    session[:user_id] = user.id
  end

  private

  def lookup_user
    if session[:user_id]
      User.find_by(id: session[:user_id]) || session[:user_id] = nil
    end
  end

  def set_order
    order = Order.find_by(id: session[current_order_key])
    return order unless order.nil?
    create_order
  end

  def current_order_key
    "#{current_restaurant.slug}_order_id".to_sym if current_restaurant
  end

  def create_order
    order = Order.create(status: "pending", restaurant: current_restaurant)
    order.update(user_id: current_user.id) if current_user
    session[current_order_key] = order.id
    order
  end

  def current_permission
    @current_permission ||= Permission.new(current_user)
  end

  def authorize
    unless current_permission.allow?(params[:controller], params[:action])
      redirect_to items_path, alert: "Not authorized."
    end
  end

end
