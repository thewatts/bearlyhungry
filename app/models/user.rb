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

  def sms
    number_to_send_to = phone_number.to_i
    twilio_sid = 'ACcbcc01e57687a227d75edf4874e76e08'
    twilio_token = 'f38445947e7bc841d5bc6b0e65cdc0a8'
    twilio_phone_number = '15177217715'
    order_id = 1

    body = "Order #{order_id} is ready!  Pipping hot, ready to serve."
    SMS.send_message(number_to_send_to, body)
  end
end
