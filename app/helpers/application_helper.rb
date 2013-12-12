module ApplicationHelper

  def order_subtotal
    current_order.subtotal
  end

  def categories
    Category.all
  end

end
