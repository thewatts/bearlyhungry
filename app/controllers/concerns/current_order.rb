module CurrentOrder

  def set_order
    if session[:order_id]
      @current_order = Order.find_by(session[:order_id])
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
