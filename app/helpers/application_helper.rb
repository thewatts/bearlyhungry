module ApplicationHelper

  def current_user
    @current_user ||= lookup_user
  end

  def lookup_user
    if session[:user_id]
      User.find(session[:user_id])
    end
  end

  def current_order
    if session[:order_id]
      @current_order = Order.find(session[:order_id])
    else
      create_order
    end
  end

  def create_order
     order = Order.create(status: "pending")
     session[:order_id] = order.id
     order
  end

end
