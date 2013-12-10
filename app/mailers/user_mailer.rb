class UserMailer < ActionMailer::Base
  default from: 'bearlyhungry@gmail.com'

  def welcome_email(user)
    @user = user
    @url = 'http://bearlyhungry.com/login'
    mail({
      to: @user.email,
      from: 'bearlyhungry@gmail.com',
      subject: 'Welcome to Bearly Hungry',
      body: 'Welcome to '})
  end

  visit menu_path
      fill_in 'login-email',    with: 'asdf@asdf.com'
      fill_in 'login-password', with: 'password'
      click_on 'login-submit'
      expect(page).to have_content "Logout"
      click_on "Add to Cart"
      click_on "Checkout"
      expect(page).not_to have_content "You must login or sign up before paying."
      expect(page).to have_content "Review Your Order"
      expect(page.current_path).to eq(review_order_path)

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
