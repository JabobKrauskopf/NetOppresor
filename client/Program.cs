using System;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Websocket.Client;
using NetFwTypeLib;
using System.Linq;
using System.Collections.Generic;

namespace JabobKrauskopf.NetOppressor
{
    public struct ClientMessage {
        public string Command;
        public string[] Ips;
    }
    class Program
    {
        static string GenerateIPRange(string[] ips)
        {
            var sortedIps = ips
                .Select(Version.Parse)
                .OrderBy(arg => arg)
                .Select(arg => arg.ToString())
                .ToList();
            var lastIp = "0.0.0.0";
            var ranges = new List<String>();
            foreach (string i in sortedIps)
            {
                string[] split_ip = i.Split(".");
                int last_digit_int = int.Parse(split_ip[3]);
                string converted_ip = string.Join(".", split_ip.Take(3)) + "." + (last_digit_int - 1).ToString();
                ranges.Add(lastIp + "-" + converted_ip);
                lastIp = string.Join(".", split_ip.Take(3)) + "." + (last_digit_int + 1).ToString();
            }
            ranges.Add(lastIp + "-" + "255.255.255.255");
            return string.Join(",", ranges);
        }
        static void AddRule(string[] ips)
        {
            try {
                INetFwRule firewallRule = (INetFwRule)Activator.CreateInstance(
                                Type.GetTypeFromProgID("HNetCfg.FWRule"));
                firewallRule.Action = NET_FW_ACTION_.NET_FW_ACTION_BLOCK;
                firewallRule.Description = "Used to block Gta V.";
                firewallRule.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_OUT;
                firewallRule.Enabled = true;
                firewallRule.InterfaceTypes = "All";
                firewallRule.Name = "BlockGtaV";
                firewallRule.Protocol = 17;
                firewallRule.RemoteAddresses = GenerateIPRange(ips);
                firewallRule.RemotePorts = "6672,61455-61458";

                INetFwPolicy2 firewallPolicy = (INetFwPolicy2)Activator.CreateInstance(
                    Type.GetTypeFromProgID("HNetCfg.FwPolicy2"));
                firewallPolicy.Rules.Add(firewallRule);
            } catch (Exception e) {
                Console.WriteLine(e.Message);
            }
        }
        static void RemoveRule()
        {
            try {
                INetFwPolicy2 firewallPolicy = (INetFwPolicy2)Activator.CreateInstance(
                    Type.GetTypeFromProgID("HNetCfg.FwPolicy2"));
                firewallPolicy.Rules.Remove("BlockGtaV");
            } catch (Exception e) {
                Console.WriteLine(e.Message);
            }
        }
        static async Task Main(string[] args)
        {
            var url = new Uri("ws://91.65.183.68:1234");
            var exitEvent = new ManualResetEvent(false);

            using var client = new WebsocketClient(url);
            client.MessageReceived.Subscribe(msg => {
                var parsedMessage = JsonConvert.DeserializeObject<ClientMessage>(msg.Text);
                switch(parsedMessage.Command) {
                    case "start":
                        AddRule(parsedMessage.Ips);
                        Console.WriteLine((DateTime.Now) + ": Added Firewall Rule\n");
                        break;
                    case "stop":
                        RemoveRule();
                        Console.WriteLine((DateTime.Now) + ": Removed Firewall Rule\n");
                        break;
                    default:
                        throw new Exception("Command not recognized");
                }
            });
            await client.Start();
            exitEvent.WaitOne();
        }
    }
}
