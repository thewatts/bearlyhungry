class OrderMailer < ActionMailer::Base
  default from: 'admin@bearlyhungry.com'
  
  def order_confirmation_email(email_data)
    @user_email = email_data[:user_email]
    @user_name = email_data[:user_name]
    @order_total = email_data[:order_total]
    @url = 'http://bearlyhungry.com'
    # email_with_name = "#{@user.full_name} <@{@user.email}>"
    mail(to: @user_email, subject: 'Thank you for your order from Bearly Hungry')
  end

  def order_ready_email(user, order_id)
    @order = order_id
    @user = user
    @url = 'http://bearlyhungry.com'
  #   email_with_name = "#{@user.full_name} <@{@user.email}>"
    mail(to: @user.email, subject: 'Get Excited!  Your order is ready')
  end
end
