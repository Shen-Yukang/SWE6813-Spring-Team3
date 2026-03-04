Feature: Behavior-aware matchmaking
  As a player
  I want to receive compatible teammates
  So that my match quality improves

  Scenario: Player gets ranked recommendations using skill and behavior
    Given users and profiles exist in the system
    When player "alice" requests matchmaking
    Then the first recommendation should be "bob"
