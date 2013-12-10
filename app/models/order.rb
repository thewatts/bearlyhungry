class Order < ActiveRecord::Base
  include AASM

  validates :status, presence: true

  has_many :order_items
  has_many :items, through: :order_items
  belongs_to :user

  aasm do
    state :pending, initial: :true
    state :confirmed
    state :paid
    state :ready_for_delivery
    state :cancelled

  event :confirm
    transition from: :pending, to: [:confirmed, :cancelled]
  end

  event
    transition from: :confirmed, to: :paid
  end

  transition from: :paid, to: :ready_for_delivery

  def self.user_orders
    where('user_id IS NOT NULL')
  end

  def self.by_status
    all.group_by {|order| order.status}
  end

  def self.count_by_status
    by_status.each_with_object({}) do |key, hash|
      hash[key.first] = key.last.count
    end
  end

  def self.completed
    where(status: "completed")
  end

  def add_item(item_id, quantity = 1)
    found_item = Item.find(item_id)
    if !items.include? found_item
      items << found_item
      order_item = OrderItem.find_by(item_id: item_id, order_id: self.id)
      order_item.quantity = quantity.to_i
      order_item.save
    else
      order_item = OrderItem.find_by(item_id: item_id, order_id: self.id)
      order_item.quantity += quantity.to_i
      order_item.save
    end
  end

  def subtotal
    order_items.map(&:subtotal).inject(:+)
  end

  def total_items
    order_items.inject(0) { |sum, item| sum + item.quantity }
  end

  def add_user(user)
    self.user_id = user.id
    self.status  = "in progress"
    self.save
  end

end
