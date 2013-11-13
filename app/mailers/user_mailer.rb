class UserMailer < ActionMailer::Base
  default from: 'wtphok@gmail.com'

  def welcome_email(user)
    @user = user
    @url = 'http://wtpho.herokuapp.com/login', :text => 'What the Pho.com'
    email_with_name = "#{@user.full_name} <@{@user.email}>"
    mail(to: @user.email, subject: 'Welcome to What the Pho')
  end

  def order_email(user, order_id)
    @order_id = order_id
    @user = user
    @url = 'http://wtpho.herokuapp.com/login', :text => 'What the Pho.com'
    email_with_name = "#{@user.full_name} <@{@user.email}>"
    mail(to: @user.email, subject: 'Thank you for your order from What the Pho')
  end

end
