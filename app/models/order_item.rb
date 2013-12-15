class OrderItem < ActiveRecord::Base
  validates  :quantity, numericality: { greater_than_or_equal_to: 1 }

  belongs_to :item
  belongs_to :order

  def subtotal
    self.quantity * self.item.price
  end
end

