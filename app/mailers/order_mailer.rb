class OrderMailer < ActionMailer::Base
  default from: 'admin@bearlyhungry.com'
  
  def order_confirmation_email(email_data)
    @user_email = email_data[:user_email]
    @user_name = email_data[:user_name]
    @order_total = email_data[:order_total]
    @order_id = email_data[:order_id]
    @user_id = email_data[:user_id]
    @order_status = email_data[:order_status]
    @created_at = email_data[:created_at]
    @order_items = email_data[:order_items]
    @url = 'http://bearlyhungry.com'
    mail(to: @user_email, subject: 'Thank you for your order from Bearly Hungry')
  end

  def order_ready_email(email_data)
    @order = email_data[:order_id]
    @user = email_data[:user_name]
    @user_email = email_data[:user_email]
    @url = 'http://bearlyhungry.com'
    mail(to: @user_email, subject: 'Get Excited!  Your order is ready')
  end
end
