class UserMailer < ActionMailer::Base
  default from: 'admin@bearlyhungry.com'

  def welcome_email(user)
    @user = user
    @url = 'http://bearlyhungry.com'
    mail({
      to: @user.email,
      subject: 'Welcome to Bearly Hungry' })
  end

  def order_confirmation_email(user, order)
    @user = user
    @order = order
    @url = 'http://bearlyhungry.com'
    # email_with_name = "#{@user.full_name} <@{@user.email}>"
    mail(to: @user.email, subject: 'Thank you for your order from Bearly Hungry')
  end

  def order_ready_email(user, order)
    @user = user
    @order = order
    @url = 'http://bearlyhungry.com'
  #   email_with_name = "#{@user.full_name} <@{@user.email}>"
    mail(to: @user.email, subject: 'Get Excited!  Your order is ready')
  end
end
