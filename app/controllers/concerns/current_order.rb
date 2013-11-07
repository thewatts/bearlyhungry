module CurrentOrder
  def set_order 
    if sessions[:order_id]
      @current_order = Order.find_by(sessions[:order_id])
    else
      create_order
    end
  end

  def create_order
     
  end
end
