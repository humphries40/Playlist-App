require 'test_helper'

class SongItemsControllerTest < ActionController::TestCase
  test "should get create" do
    get :create
    assert_response :success
  end

  test "should get delete" do
    get :delete
    assert_response :success
  end

end
