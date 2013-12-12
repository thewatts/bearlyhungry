module Features
  module SessionHelpers

    def sign_up_with(email, password)
      visit root_url
      within '#signupTab' do
        fill_in 'full-name',             with: 'Test User'
        fill_in 'email-address',         with: 'test@example.com'
        fill_in 'password',              with: 'password'
        fill_in 'password-confirmation', with: 'password'
        click_on 'signup-submit'
      end
    end

    def sign_in(user)
      visit root_url
      within '#loginTab' do
        fill_in 'login-email',    with: user.email
        fill_in 'login-password', with: 'password'
        click_on 'login-submit'
      end
    end
  end
end
