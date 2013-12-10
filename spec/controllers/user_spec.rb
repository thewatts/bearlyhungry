require './spec/spec_helper'

describe UsersController do

  before do
    @order = FactoryGirl.create(:order)
  end

  describe "GET 'new'" do
    it "should be successful" do
      get 'new'
      response.should be_success
    end
  end

  describe "#create" do
    context "creating a registered user" do
      it "creates a registered user" do
        request.env["HTTP_REFERER"] = menu_path
        post :create, user: {
          full_name: "luke",
          email: "luke@luke.com",
          password: "asdf",
          password_confirmation: "asdf"
        }
        expect(User.last.full_name).to eq("luke")
        expect(response).to be_redirect
        expect(:flash).to_not be_nil
      end
    end
  end

end

