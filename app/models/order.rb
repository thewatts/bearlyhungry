class Order < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  validates :status, presence: true
  has_many :order_items
  has_many :items, through: :order_items
  belongs_to :user

  def self.completed
    where(status: "completed")
  end

  def host(environment)
    case environment
    when "staging"
      "staging.bearlyhungry.com"
    when "production"
      "bearlyhungry.com"
    else
      "localhost:3000"
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
    
    SMS.send_message(user.phone_number, body)
  end

  def send_customer_pickup_sms
    body = "Success, #{user.full_name}!\n"
    body << "Your order is officially ready for pickup!"
  
    SMS.send_message(user.phone_number, body)
  end

  def send_owner_submitted_sms
    url = Rails.application.routes.url_helpers.admin_order_url(
      id, host: host(Rails.env)
    )
    body = "A new order was just submitted!\n"
    body << "Find more info here: #{url}"

    SMS.send_message(user.phone_number, body)
  end

  def send_order_confirmation_email 
    OrderMailer.order_confirmation_email(self, @user).deliver
  end

  def send_order_ready_email
    OrderMailer.order_ready_email(self, @user).deliver
    email_data = {
      user_email: user.email,
      user_name: user.full_name,
      order_total: subtotal
    }
    OrderMailer.order_confirmation_email(email_data).deliver
  end
end
