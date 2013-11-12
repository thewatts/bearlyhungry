class OrderItem < ActiveRecord::Base
  belongs_to :item
  belongs_to :order
  validates :quantity, numericality: { greater_than_or_equal_to: 1 }

  def subtotal
    self.quantity * self.item.price
  end
end

