class UserMailer < ActionMailer::Base
  default from: 'wtphok@gmail.com'

  def welcome_email(user)
    @user = user
    @url = 'http://bearlyhungry.com/login'
    mail({
      to: @user.email,
      from: 'bearlyhungry@gmail.com',
      subject: 'Welcome to Bearly Hungry',
      body: 'Welcome to '})
  end

  # def order_email(user, order_id)
  #   @order_id = order_id
  #   @user = current_user
  #   @url = 'http://wtpho.herokuapp.com/login', :text => 'What the Pho.com'
  #   email_with_name = "#{@user.full_name} <@{@user.email}>"
  #   mail(to: @user.email, subject: 'Thank you for your order from What the Pho')
  # end

  def order_ready_email(user, order_id)
  end

end
