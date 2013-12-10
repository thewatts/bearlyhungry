class User < UserBase
  validates :display_name, allow_blank: true, length: {
    in: 2..32,
    message: "Display name should be between 2 and 32 characters, please." }
  validates :email, uniqueness: true
  has_secure_password

  after_create :send_welome_email

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

end
