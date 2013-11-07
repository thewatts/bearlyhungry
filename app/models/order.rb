class Order < ActiveRecord::Base
  validates :status, presence: true

  has_many :order_items
  has_many :items, through: :order_items

  def add_item(item_id)
    found_item = Item.find(item_id)
    if !items.include? found_item
      items << found_item
    end
    order_item = OrderItem.find_by(item_id: item_id, order_id: self.id)
    order_item.quantity += 1
    order_item.price = found_item.price
    order_item.save
  end
end
