class RestaurantMailer < ActionMailer::Base
  default from: 'admin@bearlyhungry.com'
  
  def new_restaurant_confirmation_email(email_data)
    ## NEED TO CHANGE THE EMAIL_DATA WHEN METHOD IS MOVED FROM USER TO RESTAURANT
    @user_name = email_data[:user_name]
    @user_email = email_data[:user_email]

    mail({
      to: @user_email,
      subject: 'Your restaurant has been submitted.' })
  end

  def new_restaurant_approval_email(email_data)
    @user_name = email_data[:user_name]
    @user_email = email_data[:user_email]

    mail({
      to: @user_email,
      subject: 'Your restaurant was approved!' })

  end

  def new_restaurant_rejection_email(email_data)
    @user_name = email_data[:user_name]
    @user_email = email_data[:user_email]

    mail({
      to: @user_email,
      subject: 'Your restaurant was rejected' })

  end
end
