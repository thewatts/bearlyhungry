class User < UserBase
  validates :display_name, allow_blank: true, length: {
    in: 2..32,
    message: "Display name should be between 2 and 32 characters, please." }
  validates :email, uniqueness: true
  has_secure_password
  def admin?
    self.admin_status
  end

  def past_orders
    orders.sort_by {|order| order.created_at}.reverse
  end

  def total_spent
    orders.completed.map(&:subtotal).reduce(:+) || 0
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver
  end

  def self.find_and_authenticate(session_params)
    user = find_by(email: session_params[:email])
    if user && user.authenticate(session_params[:password])
      user
    end
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
