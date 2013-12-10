class UserMailer < ActionMailer::Base
  default from: 'wtphok@gmail.com'

  def welcome_email(user)
    @user = user
    @url = 'http://wtpho.herokuapp.com/login'
    mail({
      to: @user.email,
      from: 'wtphok@gmail.com',
      subject: 'Welcome to What the Pho'})
  end

  # def order_email(user, order_id)
  #   @order_id = order_id
  #   @user = user
  #   @url = 'http://wtpho.herokuapp.com/login', :text => 'What the Pho.com'
  #   email_with_name = "#{@user.full_name} <@{@user.email}>"
  #   mail(to: @user.email, subject: 'Thank you for your order from What the Pho')
  # end

end




# class UserMailer < ActionMailer::Base
#   default from: 'admin@bearly.com'

#   def welcome_email(user)
#     setup
#     mail({
#       to: @user.email,
#       subject: 'Welcome to Bearly Hungry' })
#   end

#   def order_email(user, order_id)
#     setup
#     order_details
#     # email_with_name = "#{@user.full_name} <@{@user.email}>"
#     mail(to: @user.email, subject: 'Thank you for your order from Bearly Hungry')
#   end

#   def order_ready_email(user, order_id)
#     setup
#     order_details
#   #   email_with_name = "#{@user.full_name} <@{@user.email}>"
#   #   mail(to: @user.email, subject: 'Thank you for your order from What the Pho')
#   end

#   private

#   def setup
#     @user = user
#     @url = 'http://bearlyhungry/login'
#   end

#   def order_details
#      @order = order_id
#   end
# end
