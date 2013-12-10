class UserBase < ActiveRecord::Base
  self.table_name = :users

  validates :full_name, presence: { message: "Please enter your full name." }
  validates :email, presence: true

  has_many :orders

  def current_order
    orders.last
  end

  def confirmation_sms_for(order)
    number_to_send_to = phone_number.to_i
    item_count = order.items.count
    body = "Thanks, #{full_name}, for your order of #{item_count} items!"
    body << "We'll send you another text when it's ready for pickup!"

    SMS.send_message(number_to_send_to, body)
  end

  def pickup_sms_for(order)
    number_to_send_to = phone_number.to_i
    item_count = order.items.count
    body = "Success, #{full_name}!\n"
    body << "Your order is ready for pickup!"

    SMS.send_message(number_to_send_to, body)
  end

end

