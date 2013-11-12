class Order < ActiveRecord::Base
  validates :status, presence: true

  has_many :order_items
  has_many :items, through: :order_items
  belongs_to :user

  def add_item(item_id)
    found_item = Item.find(item_id)
    if !items.include? found_item
      items << found_item
      order_item = OrderItem.find_by(item_id: item_id, order_id: self.id)
      order_item.save
    else
      order_item = OrderItem.find_by(item_id: item_id, order_id: self.id)
      order_item.quantity += 1
      order_item.save
    end
  end

  def self.user_orders
    all.select {|order| !order.user_id.nil?}
  end

  def self.by_status
    all.group_by {|order| order.status}
  end

  def self.count_by_status
    by_status.each_with_object({}) do |key, hash|
      hash[key.first] = key.last.count
    end
  end

  def subtotal
    total = 0
    order_items.each do |order_item|
      total += order_item.subtotal
    end
    total
  end
end
