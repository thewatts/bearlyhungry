require './spec/spec_helper'

describe UserMailer do

  it "should send welcoming email" do
    visit root_path
    click_on "Sign Up"

    assert_content page, 'Contact Us'
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
