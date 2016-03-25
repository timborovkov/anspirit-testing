#include "VirtualWire.h"

#define ledPin 13
#define txPin 8

char *controller;

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  
  vw_set_ptt_inverted(true);
  vw_set_tx_pin(txPin);
  vw_setup(4000);// speed of data transfer Kbps
  
  Serial.begin(9600);
}

void loop() {
  if(Serial.available() > 0){
    char letter = Serial.read();

    if(letter == '1'){
      digitalWrite(ledPin, HIGH);
      Serial.println("LED is on");
    }else if(letter == '0'){
      digitalWrite(ledPin, LOW);
      Serial.println("LED is off");
    }else if(letter == 'x'){
      
      controller="A1";
      vw_send((uint8_t *)controller, strlen(controller));
      vw_wait_tx(); // Wait until the whole message is gone
      digitalWrite(txPin,1);

      Serial.println("Sent HIGH via 433mhz");
    }else if(letter == 'z'){
      
      controller="A0";
      vw_send((uint8_t *)controller, strlen(controller));
      vw_wait_tx(); // Wait until the whole message is gone
      digitalWrite(txPin,0);
      
      Serial.println("Sent LOW via 433mhz");
    }    
  }
}
