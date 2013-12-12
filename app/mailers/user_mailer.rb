class UserMailer < ActionMailer::Base
  default from: 'admin@bearlyhungry.com'

  def welcome_email(user)
    @user = user
    @url = 'http://bearlyhungry.com'
    mail({
      to: @user.email,
      subject: 'Welcome to Bearly Hungry' })
  end
end
