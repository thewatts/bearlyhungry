class Order < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  validates :status, presence: true
  has_many :order_items
  has_many :items, through: :order_items
  belongs_to :user
  
  def self.pending
    where(status: "pending")
  end

  def self.completed
    where(status: "completed")
  end

  def self.paid
    where(status: "paid")
  end

  def update_status(new_status)
    Order.update(status: new_status)
  end

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

  def add_item(item_id, quantity = 1)
    found_item = Item.find(item_id)
    unless items.include? found_item
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

  def send_customer_confirmation_sms
    body = "Thanks #{user.full_name} for your order of #{items.count} items!\n"
    body << "We'll send you another text when it's ready for pickup!"
    @order.send_order_confirmation_email
    SMS.send_message(user.phone_number, body)
  end

  def send_customer_pickup_sms
    body = "Success, #{user.full_name}!\n"
    body << "Your order is officially ready for pickup!"
    # @order.send_order_ready_email
    SMS.send_message(user.phone_number, body)
  end

  def send_owner_submitted_sms
    url = Rails.application.routes.url_helpers.admin_order_url(id, host: "localhost:3000")
    body = "A new order was just submitted!\n"
    body << "Find more info here: #{url}"

    SMS.send_message(user.phone_number, body)
  end

  def send_order_confirmation_email
    OrderMailer.order_confirmation_email(self, @user).deliver
  end

  def send_order_ready_email
    OrderMailer.order_ready_email(self, @user).deliver
  end
end
