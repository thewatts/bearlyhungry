require './spec/spec_helper'

describe UserMailer do

  it "should send welcoming email" do
    visit root_path
    click_on "Sign Up"
      fill_in 'email',    with: 'asdf@asdf.com'
      fill_in 'password', with: 'password'
      click_on 'login-submit'
      expect(page).to have_content "Logout"
      click_on "Add to Cart"
      click_on "Checkout"
      expect(page).not_to have_content "You must login or sign up before paying."
      expect(page).to have_content "Review Your Order"
      expect(page.current_path).to eq(review_order_path)
    within "#signup" do
      fill_in "Name", with: "Bobcat G."
      fill_in "Email", with: "question_guy@example.com"
      fill_in "Subject", with: "Question"
      fill_in "Comment", with: "Is America is one of the finest countries anyone ever stole?"
      click_button "Enter"
    end
    assert_content page, 'Thanks for your message!'
    assert_equal "Question", last_email.subject
  end

end
