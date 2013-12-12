require './spec/spec_helper'

describe Order do
  before(:each) do
    I18n.enforce_available_locales = false
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.build(:user, id: 1,
                                      full_name: "Antony THEMAN",
                                      email: "asdf@example.com",
                                      password: "password",
                                      password_confirmation: "password",
                                      display_name: "A DAWG",
                                      phone_number: "7742398699"
                                      )
     @order = FactoryGirl.create(:order)
  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  it 'should send an order confirmation email' do
    @order.send_order_confirmation_email
    ActionMailer::Base.deliveries.first.to.should.to_s == @user.email
  end

  it 'sends an order ready email' do
    @order.send_order_ready_email
    ActionMailer::Base.deliveries.count.should == 1
  end
end
