class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def set_order
    if session[:order_id]
      if Order.find(session[:order_id])
        @current_order = Order.find(session[:order_id])
      else
        reset_session
        create_order
      end
    else
      create_order
    end
  end

  def create_order
     order = Order.create(status: "pending")
     session[:order_id] = order.id
     order
  end

  def current_user
    @current_user ||= lookup_user
  end

  def lookup_user
    if session[:user_id]
      User.find(session[:user_id])
    end
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
