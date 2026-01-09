define({
  /* -------------------------   [Trixon] Start   -------------------------- */
  formInit: function () {
    applicationManager
      .getPresentationFormUtility()
      .initCommonActions(
        self,
        "YES",
        applicationManager.getNavigationManager().getCurrentForm()
      );
  },

  // [Trixon] Global declaration for commonly used resources {Business Managers, Presentation Modules, Scope declaration}
  formPreshow: function () {
    self = this;
    navManager = applicationManager.getNavigationManager();
    formatUtil = applicationManager.getFormatUtilManager();
    transferMod = kony.mvc.MDAApplication.getSharedInstance()
      .getModuleManager()
      .getModule({
        moduleName: "MoneyMovementUIModule",
        appName: "TransfersMA",
      });
    paymentMod = kony.mvc.MDAApplication.getSharedInstance()
      .getModuleManager()
      .getModule({ moduleName: "BillPaymentUIModule", appName: "BillPayMA" });
    homeMod = kony.mvc.MDAApplication.getSharedInstance()
      .getModuleManager()
      .getModule({ moduleName: "AccountsUIModule", appName: "HomepageMA" });
    self.refreshAccountBalance();

    self.setData();
    self.initActions();
    this.actionInProgess = false;
    this.unlockButtons();
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  },

  // [Trixon] Invoke service to refresh account balance
  refreshAccountBalance: function () {
    kony.store.setItem("forApolloAccountBalanceRefresh", true);
//    kony.store.setItem("commonMA", true);
        kony.store.setItem("NewcommonMA", true);
    // navManager.setCustomInfo("forApolloAccountBalanceRefresh", true);
    homeMod.presentationController.showDashboard();
  },

  // [Trixon] Action assignment for form widgets
  initActions: function () {
    var controller = this;
    self.view.onDeviceBack = function () {};
    controller.view.flxSave.onClick = function () {
      controller.shareReceipt(true);
    };

    controller.view.btnNewTransfer.onClick = function () {
      controller.navigateToModule();
    };
    controller.view.btnBackToHome.onClick = function () {
      controller.navigateToHome();
    };
    self.view.brwQRCode.onFailure = function () {
      if (self.view.flxQRContainer.isVisible) {
        self.view.brwQRCode.reload();
      }
    };
  },

  // [Trixon] Transaction detail mapping
  setData: function () {
    self.view.flxPopup.setVisibility(false);
    self.view.brwQRCode.setVisibility(false);
    successData = navManager.getCustomInfo("apolloTransactionSuccessResponse");
    self.view.segTransactionDetail.removeAll();
    self.view.flxTransactionDetails.height = "46.5%";
    self.view.flxQRContainer.setVisibility(true);
    self.view.lblQROnReceipt.setVisibility(true);
    self.view.lblQR.setVisibility(true);
    self.view.imgTransactionDetail.height = "71%";
    self.view.imgQR.setVisibility(true);
    self.view.imgQR.src = "apollotransparenticon.png";
    refID = "";

    // [Trixon] Common segment values
    var segData = [
      {
        lblAttribute: kony.i18n.getLocalizedString("cs.apollo.SourceAccount"),
        lblValue: successData.requestPayload.senderAccount,
      },
      {
        lblAttribute: kony.i18n.getLocalizedString(
          "cs.apollo.SourceAccountName"
        ),
        lblValue: successData.requestPayload.senderName,
      },
    ];

    // [Trixon] Success Response Mapping for Transfers {Within BOA, RTGS, EthSwitch, Telebirr, ATM Withdrawal {New and Resend}, Awach, MPesa, MPesa Trust}
    if (successData.requestPayload.category === "Transfer") {
      self.view.lblSuccess.text = kony.i18n.getLocalizedString(
        "cs.apollo.TransferSuccessful"
      );
      self.view.btnNewTransfer.text = kony.i18n.getLocalizedString(
        "cs.apollo.NewTransfer"
      );
      let transactionDate = formatUtil.formatDateForDisplay(
        successData.httpresponse.headers.Date
      );
      let formattedAmount =
        kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") +
        " " +
        formatUtil.formatAmount(successData.requestPayload.amount);
      if (
        successData.requestPayload.transactionType === "Other Bank" ||
        successData.requestPayload.transactionType === "Telebirr" ||
        successData.requestPayload.transactionType === "MPesa" ||
        successData.requestPayload.transactionType === "MPesa Trust"
      ) {
        segData.push({
          lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Amount"),
          lblValue: formattedAmount,
        });
      } else {
        segData.push({
          lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Amount"),
          lblValue: formattedAmount,
        });
      }
      if (
        successData.requestPayload.transactionType === "ATM Withdrawal" &&
        successData.requestPayload.transactionSubtype &&
        successData.requestPayload.transactionSubtype === "ATM Resend"
      ) {
        segData.push(
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.MobileNumber"
            ),
            lblValue: "+251" + successData.requestPayload.receiverPhone,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionType"
            ),
            lblValue: kony.i18n.getLocalizedString("cs.apollo.ATMCodeResend"),
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionReference"
            ),
            lblValue: successData.requestPayload.atmReferenceId,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionDate"
            ),
            lblValue: transactionDate,
          }
        );
        refID = successData.requestPayload.atmReferenceId;
      } else {
        var receiverValue =
          successData.requestPayload.transactionType === "Telebirr" ||
          successData.requestPayload.transactionType === "ATM Withdrawal" ||
          successData.requestPayload.transactionType === "MPesa"
            ? "+251" + successData.requestPayload.receiverAccount
            : successData.requestPayload.receiverAccount;
        if (
          successData.requestPayload.transactionType === "QR Payment" &&
          successData.requestPayload.transactionSubtype === "with Tip"
        ) {
          segData.push({
            lblAttribute: "Tip Amount",
            lblValue:
              kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") +
              " " +
              formatUtil.formatAmount(successData.requestPayload.tipAmount),
          });
        }
        segData.push(
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.ReceiverAccount"
            ),
            lblValue: receiverValue,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.ReceiverAccountName"
            ),
            lblValue: successData.requestPayload.receiverName,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionType"
            ),
            lblValue: successData.requestPayload.transactionType,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionReference"
            ),
            lblValue: successData.referenceId,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionDate"
            ),
            lblValue: transactionDate,
          }
        );
        if (successData.requestPayload.transactionType === "Other Bank") {
          segData.push({
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.BankName"),
            lblValue: successData.requestPayload.receiverBank,
          });
        }
        segData.push({
          lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Note"),
          lblValue: successData.requestPayload.remark,
        });
        refID = successData.referenceId;
      }
    }

    // [Trixon] Success Response Mapping for Utility Payments
    else if (successData.requestPayload.category === "Payment") {
      self.view.lblSuccess.text =
        successData.requestPayload.frequency !== "Once"
          ? kony.i18n.getLocalizedString("cs.apollo.ScheduledSuccessfully")
          : kony.i18n.getLocalizedString("cs.apollo.PaymentSuccessful");
      self.view.btnNewTransfer.text =
        successData.requestPayload.frequency !== "Once"
          ? kony.i18n.getLocalizedString("cs.apollo.NewSchedule")
          : successData.requestPayload.paymentType === "EthioTelTopup" ||
            successData.requestPayload.paymentType === "SafaricomTopup" ||
            successData.requestPayload.paymentType === "EthioTelPackage"
          ? kony.i18n.getLocalizedString("cs.apollo.NewTopup")
          : kony.i18n.getLocalizedString("cs.apollo.NewPayment");
      let transactionDate = formatUtil.formatDateForDisplay(
        successData.httpresponse.headers.Date
      );
      refID =
        successData.requestPayload.paymentType === "US Visa" ||
        successData.requestPayload.paymentType === "Seregela"
          ? successData.header.id
          : successData.referenceId;
      let formattedAmount =
        kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") +
        " " +
        formatUtil.formatAmount(successData.requestPayload.amount);
      segData.push({
        lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Amount"),
        lblValue: formattedAmount,
      });

      // [Trixon] Success Response Mapping for Schedule Payments
      if (successData.requestPayload.frequency !== "Once") {
        self.view.flxTransactionDetails.height = "60%";
        self.view.flxQRContainer.setVisibility(false);
        self.view.lblQROnReceipt.setVisibility(true);
        self.view.lblQR.setVisibility(false);
        self.view.imgTransactionDetail.height = "90%";
        self.view.imgQR.setVisibility(false);
        if (
          successData.requestPayload.paymentType === "Within BOA" ||
          successData.requestPayload.paymentType === "Other Bank"
        ) {
          if (successData.requestPayload.scheduleAction === "Edit") {
            var receiverAccountName =
              successData.requestPayload.paymentType === "Within BOA"
                ? successData.requestPayload.editScheduledPayment
                    .beneficiaryName
                : successData.requestPayload.paymentSubtype === "RTGS"
                ? successData.requestPayload.editScheduledPayment.recipientName
                : successData.requestPayload.payeeDetails.body[0]
                    .beneficiaryName;
          } else {
            var receiverAccountName =
              successData.requestPayload.paymentType === "Within BOA"
                ? successData.requestPayload.receiverName
                : successData.requestPayload.paymentSubtype === "RTGS"
                ? successData.requestPayload.recipientName
                : successData.requestPayload.payeeDetails.body[0]
                    .beneficiaryName;
          }
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.ReceiverAccount"
              ),
              lblValue:
                successData.requestPayload.scheduleAction === "Edit"
                  ? successData.requestPayload.editScheduledPayment
                      .toAccountNumber
                  : successData.requestPayload.receiverAccount,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.ReceiverAccountName"
              ),
              lblValue: receiverAccountName,
            }
          );
        }
        segData.push(
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionType"
            ),
            lblValue:
              kony.i18n.getLocalizedString("cs.apollo.SchedulePayment") +
              "-" +
              successData.requestPayload.paymentType,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionReference"
            ),
            lblValue: refID,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionDate"
            ),
            lblValue: transactionDate,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.PaymentName"),
            lblValue: successData.requestPayload.schedulePaymentName,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.StartDate"),
            lblValue: successData.requestPayload.scheduleStartDate,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.EndDate"),
            lblValue: successData.requestPayload.scheduleEndDate,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Frequency"),
            lblValue: successData.requestPayload.frequency,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Reminder"),
            lblValue:
              successData.requestPayload.scheduleReminder.lblNationality,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Note"),
            lblValue: successData.requestPayload.remark,
          }
        );
      }

      // [Trixon] Success Response Mapping for Bill Payments
      else {
        if (
          successData.requestPayload.paymentType === "EthioTelTopup" ||
          successData.requestPayload.paymentType === "SafaricomTopup" ||
          successData.requestPayload.paymentType === "EthioTelPackage"
        ) {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.MobileNumber"
              ),
              lblValue: "+" + successData.requestPayload.phoneNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue:
                successData.requestPayload.paymentType === "EthioTelTopup"
                  ? kony.i18n.getLocalizedString("cs.apollo.Ethiotelecom")
                  : successData.requestPayload.paymentType === "EthioTelPackage"
                  ? "Ethio Tel " +
                    successData.requestPayload.packageNameDisplay +
                    " " +
                    successData.requestPayload.packageIdDisplay
                  : kony.i18n.getLocalizedString("cs.apollo.Safaricom"),
            }
          );
        } else if (
          successData.requestPayload.paymentType === "Postpaid" ||
          successData.requestPayload.paymentType === "Websprix"
        ) {
          let billNo = successData.requestPayload.paymentMode.replace(" ", "");
          billNo = billNo.charAt(0).toLowerCase() + billNo.slice(1);
          segData.push(
            {
              lblAttribute: successData.requestPayload.paymentMode,
              lblValue:
                successData.requestPayload.paymentType === "Websprix" &&
                successData.requestPayload.paymentMode ===
                  kony.i18n.getLocalizedString("cs.apollo.PhoneNumber")
                  ? "+251" + successData.requestPayload[billNo]
                  : successData.requestPayload[billNo],
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.CustomerName"
              ),
              lblValue: successData.requestPayload.customerName,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue:
                successData.requestPayload.paymentType === "Postpaid"
                  ? kony.i18n.getLocalizedString(
                      "cs.apollo.EthiotelecomPostpaid"
                    )
                  : kony.i18n.getLocalizedString("cs.apollo.WebsprixPayment"),
            }
          );
        } else if (
          successData.requestPayload.paymentType === "Airlines" ||
          successData.requestPayload.paymentType === "Guzogo"
        ) {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.PassengerName"
              ),
              lblValue: successData.requestPayload.customerName,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.PNR"),
              lblValue: successData.requestPayload.pnr.toUpperCase(),
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue:
                successData.requestPayload.paymentType === "Airlines"
                  ? kony.i18n.getLocalizedString("cs.apollo.EthiopianAirlines")
                  : kony.i18n.getLocalizedString("cs.apollo.GuzogoPayment"),
            }
          );
        } else if (successData.requestPayload.paymentType === "US Visa") {
          var visitorsName = successData.requestPayload.orderedBy.split(",");
          for (var i = 0; i < visitorsName.length; i++) {
            segData.push({
              lblAttribute:
                i === 0 ? kony.i18n.getLocalizedString("cs.apollo.Name") : "",
              lblValue: visitorsName[i].trim(),
            });
          }
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.PIN"),
              lblValue: successData.requestPayload.pin,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n.getLocalizedString("cs.apollo.USVisaPayment"),
            }
          );
        } else if (successData.requestPayload.paymentType === "Dstv") {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.SmartCardNumber"
              ),
              lblValue: successData.requestPayload.smartcardNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.CustomerName"
              ),
              lblValue: successData.requestPayload.payeeDetails.customerName,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.BillType"),
              lblValue: successData.requestPayload.paymentSubtype,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n
                .getLocalizedString("cs.apollo.Dstv")
                .toUpperCase(),
            }
          );
        } else if (successData.requestPayload.paymentType === "School Fee") {
          if (successData.requestPayload.penaltyAmount !== "0.00") {
            segData.push({
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Penalty"),
              lblValue:
                kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") +
                " " +
                formatUtil.formatAmount(
                  successData.requestPayload.penaltyAmount
                ),
            });
          }
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.StudentID"),
              lblValue: successData.requestPayload.studentID,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.StudentName"
              ),
              lblValue: successData.requestPayload.studentName,
            }
          );
          if (successData.requestPayload.billType !== "Special") {
            segData.push({
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.PaymentPeriod"
              ),
              lblValue: successData.requestPayload.paymentPeriod,
            });
          } else {
            segData.push({
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.Description"
              ),
              lblValue: successData.requestPayload.specialFeeDescription,
            });
          }
          segData.push({
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionType"
            ),
            lblValue:
              kony.i18n.getLocalizedString("cs.apollo.SchoolFee") +
              "-" +
              successData.requestPayload.billType,
          });
        } else if (successData.requestPayload.paymentType === "FHC") {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.BillNumber"
              ),
              lblValue: successData.requestPayload.billNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.CustomerName"
              ),
              lblValue: successData.requestPayload.customerName,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n.getLocalizedString(
                "cs.apollo.FederalHousingCorp"
              ),
            }
          );
        } else if (successData.requestPayload.paymentType === "Water Bill") {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.CustomerID"
              ),
              lblValue: successData.requestPayload.customerID,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.CustomerName"
              ),
              lblValue: successData.requestPayload.customerName,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.City"),
              lblValue: successData.requestPayload.cityID,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n.getLocalizedString("cs.apollo.WaterBill"),
            }
          );
        } else if (
          successData.requestPayload.paymentType === "Traffic Payment"
        ) {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.DriverName"
              ),
              lblValue: successData.requestPayload.driverName,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.PlateNumber"
              ),
              lblValue: successData.requestPayload.plateNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.PaymentOrderNumber"
              ),
              lblValue: successData.requestPayload.orderNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.IssueDate"),
              lblValue: successData.requestPayload.issueDate,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n.getLocalizedString(
                "cs.apollo.TrafficPenaltyPayment"
              ),
            }
          );
        } else if (
          successData.requestPayload.paymentType === "Parking Payment"
        ) {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.PlateNumber"
              ),
              lblValue: successData.requestPayload.plateNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.ParkingArea"
              ),
              lblValue: successData.requestPayload.parkingArea,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TicketNumber"
              ),
              lblValue: successData.requestPayload.ticketNumber,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.IssueDate"),
              lblValue: successData.requestPayload.issueDate,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n.getLocalizedString(
                "cs.apollo.ParkingPayment"
              ),
            }
          );
        } else if (successData.requestPayload.paymentType === "Seregela") {
          segData.push(
            {
              lblAttribute: kony.i18n.getLocalizedString("cs.apollo.OrderID"),
              lblValue: successData.requestPayload.orderId,
            },
            {
              lblAttribute: kony.i18n.getLocalizedString(
                "cs.apollo.TransactionType"
              ),
              lblValue: kony.i18n.getLocalizedString(
                "cs.apollo.SeregelaGebeyaOnly"
              ),
            }
          );
        }
        segData.push(
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionReference"
            ),
            lblValue: refID,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString(
              "cs.apollo.TransactionDate"
            ),
            lblValue: transactionDate,
          },
          {
            lblAttribute: kony.i18n.getLocalizedString("cs.apollo.Note"),
            lblValue: successData.requestPayload.remark,
          }
        );
      }
    }
    // [Trixon] Set Data to Segment
    self.view.segTransactionDetail.setData(segData);
  },

  // [Trixon] Encrypt QR content and Load browser widget with QR generator url
  generateQRCode: function (refID) {
    [0, 1].forEach(function (q) {
      var plainQRData = "R " + refID;
      var cryptoKey = kony.crypto.createPBKDF2Key(
        "SHA1",
        "vLLbLsmCcs6Pd1TAlpp79f9rLL4Fy3u3",
        "salt",
        10000,
        256
      );
      var cryptObj = { padding: "pkcs5", mode: "cbc" };
      if (kony.os.deviceInfo().name === "iPhone") {
        cryptObj = { padding: "pkcs7", mode: "cbc" };
      }
      var rawEncryptedData = kony.crypto.encrypt(
        "aes",
        cryptoKey,
        plainQRData,
        cryptObj
      );
      var encryptedData = kony.convertToBase64(rawEncryptedData);
      self.view.brwQRCode.enableSoftwareRendering = true;
      self.view.brwQRCode.evaluateJavaScript(
        "doqr('" +
          encryptedData.toString() +
          "','" +
          JSON.stringify({
            width: "100",
            height: "100",
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: "1",
          }) +
          "');"
      );
    });
  },

  // // [Trixon] Create Transaction receipt from success flex and share receipt as base 64 image
  // shareReceipt : function(fromSave){
  //     try{
  //         self.view.forceLayout();
  //         try{var imgTransactionDetailObject = kony.image.createImageFromSnapShot(self.view.flxTransactionDetails);}
  //         catch(erEX){var imgTransactionDetailObject = kony.image.createImageFromSnapShot(self.view.flxTransactionDetails);}
  //         if(self.view.flxQRContainer.isVisible) { var imgQRObject = kony.image.createImageFromSnapShot(self.view.flxQRContainer); }
  //         kony.timer.schedule("createImageTimer", function(){
  //             self.view.imgTransactionDetail.src = imgTransactionDetailObject;
  //             if(self.view.flxQRContainer.isVisible) { self.view.imgQR.src = imgQRObject; }
  //             kony.timer.schedule("downloadReceiptTimer", function(){
  //                 var imgObject = kony.image.createImageFromSnapShot(self.view.flxReceiptContainer);
  //                 var imgRaw = imgObject.getImageAsRawBytes();
  //                 var base64 = kony.convertToBase64(imgRaw);
  //                 if(fromSave) {
  //                     var config = { albumName: "Apollo Receipts", extensionType: kony.image.ENCODE_PNG, onSuccess: successCallback, onFailure: failureCallback };
  //                     imgObject.writeToMediaGallery(config);
  //                 }else { self.view.socialshare.shareWithBase64(base64, "ApolloReceipt.png"); }
  //             }, 0.3, false);
  //         }, 0.3, false);
  //         function successCallback(result){ self.bindGenericSuccess(kony.i18n.getLocalizedString("cs.apollo.ReceiptSuccessfull")); }
  //         function failureCallback(result){ self.bindGenericError(kony.i18n.getLocalizedString("cs.apollo.UnableToDownloadReceipt")); }
  //     }catch(errorEx){}
  // },

  // [Trixon] Create Transaction receipt from success flex and share receipt as base 64 image
  shareReceipt: function (fromSave) {
    var self = this;
    if (self.actionInProgess) return;

    self.lockButtons();
    try {
      self.view.forceLayout();
      try {
        var imgTransactionDetailObject = kony.image.createImageFromSnapShot(
          self.view.flxTransactionDetails
        );
      } catch (erEX) {
        var imgTransactionDetailObject = kony.image.createImageFromSnapShot(
          self.view.flxTransactionDetails
        );
      }
      try {
        if (self.view.flxQRContainer.isVisible) {
          var imgQRObject = kony.image.createImageFromSnapShot(
            self.view.flxQRContainer
          );
        }
      } catch (errorCap) {
        if (self.view.flxQRContainer.isVisible) {
          var imgQRObject = kony.image.createImageFromSnapShot(
            self.view.flxQRContainer
          );
        }
      }

      var createTimerId = "createImageTimer_" + new Date().getTime();
      kony.timer.schedule(
        createTimerId,
        function () {
          self.view.imgTransactionDetail.src = imgTransactionDetailObject;
          if (self.view.flxQRContainer.isVisible) {
            self.view.imgQR.src = imgQRObject;
          }
          var downloadTimerId = "downloadReceiptTimer_" + new Date().getTime();
          kony.timer.schedule(
            downloadTimerId,
            function () {
              try {
                var imgObject = kony.image.createImageFromSnapShot(
                  self.view.flxReceiptContainer
                );
              } catch (errorLast) {
                var imgObject = kony.image.createImageFromSnapShot(
                  self.view.flxReceiptContainer
                );
              }
              var imgRaw = imgObject.getImageAsRawBytes();
              var base64 = kony.convertToBase64(imgRaw);
              if (fromSave) {
                var config = {
                  albumName: "Apollo Receipts",
                  extensionType: kony.image.ENCODE_PNG,
                  onSuccess: successCallback,
                  onFailure: failureCallback,
                };
                imgObject.writeToMediaGallery(config);
              } else {
                self.view.socialshare.shareWithBase64(
                  base64,
                  "ApolloReceipt.png"
                );
                self.unlockButtons();
              }
            },
            0.3,
            false
          );
        },
        0.3,
        false
      );
      function successCallback(result) {
        self.unlockButtons();
        self.bindGenericSuccess(
          kony.i18n.getLocalizedString("cs.apollo.ReceiptSuccessfull")
        );
      }
      function failureCallback(result) {
        self.unlockButtons();
        self.bindGenericError(
          kony.i18n.getLocalizedString("cs.apollo.UnableToDownloadReceipt")
        );
      }
    } catch (errorEx) {
      alert(errorEx);
    }
  },

  // [Trixon] Navigation back to respective transaction type dashboard
  navigateToModule: function () {
    if (this.actionInProgess) return;
    this.lockButtons();
    if (
      self.view.btnNewTransfer.text ===
      kony.i18n.getLocalizedString("cs.apollo.NewTransfer")
    ) {
      navManager.navigateTo({
        appName: "TransfersMA",
        friendlyName: "MoneyMovementUIModule/frmTransferDashboard",
      });
    } else if (
      self.view.btnNewTransfer.text ===
      kony.i18n.getLocalizedString("cs.apollo.NewPayment")
    ) {
      navManager.navigateTo({
        appName: "BillPayMA",
        friendlyName: "BillPaymentUIModule/frmUtilityDashboard",
      });
    } else if (
      self.view.btnNewTransfer.text ===
      kony.i18n.getLocalizedString("cs.apollo.NewSchedule")
    ) {
      paymentMod.presentationController.fetchScheduledPayments();
    } else if (
      self.view.btnNewTransfer.text ===
      kony.i18n.getLocalizedString("cs.apollo.NewTopup")
    ) {
      navManager.navigateTo({
        appName: "BillPayMA",
        friendlyName: "BillPaymentUIModule/frmUtilityDashboard",
      });
      var controller = applicationManager
        .getPresentationUtility()
        .getController("frmUtilityDashboard", true);
      controller.topupOnClick();
      controller.topupOnClick();
    }
  },

  // [Trixon] Navigation back to unified dashboard
  navigateToHome: function () {
    if (this.actionInProgess) return;

    this.lockButtons();
    navManager.navigateTo({
      appName: "HomepageMA",
      friendlyName: "AccountsUIModule/frmUnifiedDashboard",
    });
  },

  // [Trixon] Dismiss loading screen after full screen load and log the current form for test and debug purpose
  formPostshow: function () {
    applicationManager
      .getPresentationFormUtility()
      .logFormName(navManager.getCurrentForm());
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    // [Trixon] Call Qr Generator function with content to be embeded
    if (successData.requestPayload.frequency === "Once") {
      self.generateQRCode(refID);
    }
    navManager.setCustomInfo("apolloTransactionObject", {});
    navManager.setCustomInfo("apolloPaymentObject", {});
    navManager.setCustomInfo("apolloTransactionSuccessResponse", {});
  },

  lockButtons: function () {
    var self = this;
    this.actionInProgess = true;

    self.view.btnNewTransfer.setEnabled(false);
    self.view.btnBackToHome.setEnabled(false);
  },

  unlockButtons: function () {
    var self = this;
    this.actionInProgess = false;

    self.view.btnNewTransfer.setEnabled(true);
    self.view.btnBackToHome.setEnabled(true);
  },

  // [Trixon] Display success toast
  bindGenericSuccess: function (msg) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    applicationManager
      .getDataProcessorUtility()
      .showToastMessageSuccess(self, msg);
  },

  // [Trixon] Display error toast
  bindGenericError: function (msg) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    applicationManager
      .getDataProcessorUtility()
      .showToastMessageError(self, msg);
  },
  /* -------------------------   [Trixon] End   -------------------------- */
});
