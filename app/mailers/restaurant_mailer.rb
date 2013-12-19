class RestaurantMailer < ActionMailer::Base
  default from: 'admin@bearlyhungry.com'
  
  def new_restaurant_confirmation_email(email)
    mail({
      to: email,
      subject: 'Your restaurant was approved!' })
  end

  def new_restaurant_approval_email(email)
    mail({
      to: email,
      subject: 'Your restaurant was approved!' })
  end

  def new_restaurant_rejection_email(email)
    mail({
      to: email,
      subject: 'Your restaurant was rejected' })

  end

  def new_restaurant_submitted_email(email_data)
    @admin_email = email_data[:admin_email]
    mail({
      to: @admin_email,
      subject: 'Your restaurant was rejected' })
  end

end

