import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockThemeProvider from '__mocks__/MockThemeProvider';
import { api } from 'api';
import VulnerabilitiesDetails from 'components/Tag/Tabs/VulnerabilitiesDetails';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('xlsx');

const StateVulnerabilitiesWrapper = () => {
  return (
    <MockThemeProvider>
      <MemoryRouter>
        <VulnerabilitiesDetails name="mongo" />
      </MemoryRouter>
    </MockThemeProvider>
  );
};

const simpleMockCVEList = {
 CVEListForImage: {
    Tag: '',
    Page: { ItemCount: 2, TotalCount: 2 },
    Summary: {
      Count: 2,
      UnknownCount: 0,
      LowCount: 0,
      MediumCount: 1,
      HighCount: 0,
      CriticalCount: 1,
    },
    CVEList: [
      {
        Id: 'CVE-2020-16156',
        Title: 'perl-CPAN: Bypass of verification of signatures in CHECKSUMS files',
        Description: 'CPAN 2.28 allows Signature Verification Bypass.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'perl-base',
            PackagePath: 'Not Specified',
            InstalledVersion: '5.30.0-9ubuntu0.2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2016-1000027',
        Title: 'spring: HttpInvokerServiceExporter readRemoteInvocation method untrusted java deserialization',
        Description: "Pivotal Spring Framework through 5.3.16 suffers from a potential remote code execution (RCE) issue if used for Java deserialization of untrusted data. Depending on how the library is implemented within a product, this issue may or not occur, and authentication may be required. NOTE: the vendor's position is that untrusted data is not an intended use case. The product's behavior will not be changed because some users rely on deserialization of trusted data.",
        Severity: 'CRITICAL',
        Reference: 'https://avd.aquasec.com/nvd/cve-2016-1000027',
        PackageList: [
            {
                Name: 'org.springframework:spring-web',
                PackagePath: 'usr/local/tomcat/webapps/spring4shell.war/WEB-INF/lib/spring-web-5.3.15.jar',
                InstalledVersion: '5.3.15',
                FixedVersion: '6.0.0'
            }
        ]
      },
    ]
  }
}

const mockCVEList = {
  CVEListForImage: {
    Tag: '',
    Page: { ItemCount: 20, TotalCount: 20 },
    Summary: {
      Count: 5,
      UnknownCount: 1,
      LowCount: 1,
      MediumCount: 1,
      HighCount: 1,
      CriticalCount: 1,
    },
    CVEList: [
      {
        Id: 'CVE-2020-16156',
        Title: 'perl-CPAN: Bypass of verification of signatures in CHECKSUMS files',
        Description: 'CPAN 2.28 allows Signature Verification Bypass.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'perl-base',
            PackagePath: 'Not Specified',
            InstalledVersion: '5.30.0-9ubuntu0.2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-36222',
        Title:
          'krb5: Sending a request containing PA-ENCRYPTED-CHALLENGE padata element without using FAST could result in NULL dereference in KDC which leads to DoS',
        Description:
          'ec_verify in kdc/kdc_preauth_ec.c in the Key Distribution Center (KDC) in MIT Kerberos 5 (aka krb5) before 1.18.4 and 1.19.x before 1.19.2 allows remote attackers to cause a NULL pointer dereference and daemon crash. This occurs because a return value is not properly managed in a certain situation.',
        Severity: 'HIGH',
        PackageList: [
          {
            Name: 'krb5-locales',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libgssapi-krb5-2',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libk5crypto3',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5-3',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5support0',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-4209',
        Title: 'GnuTLS: Null pointer dereference in MD_UPDATE',
        Description:
          "A NULL pointer dereference flaw was found in GnuTLS. As Nettle's hash update functions internally call memcpy, providing zero-length input may cause undefined behavior. This flaw leads to a denial of service after authentication in rare circumstances.",
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libgnutls30',
            PackagePath: 'Not Specified',
            InstalledVersion: '3.6.13-2ubuntu1.6',
            FixedVersion: '3.6.13-2ubuntu1.7'
          }
        ]
      },
      {
        Id: 'CVE-2022-1586',
        Title: 'pcre2: Out-of-bounds read in compile_xclass_matchingpath in pcre2_jit_compile.c',
        Description:
          'An out-of-bounds read vulnerability was discovered in the PCRE2 library in the compile_xclass_matchingpath() function of the pcre2_jit_compile.c file. This involves a unicode property matching issue in JIT-compiled regular expressions. The issue occurs because the character was not fully read in case-less matching within JIT.',
        Severity: 'CRITICAL',
        PackageList: [
          {
            Name: 'libpcre2-8-0',
            PackagePath: 'Not Specified',
            InstalledVersion: '10.34-7',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-20223',
        Title: '',
        Description:
          'An issue was found in fts5UnicodeTokenize() in ext/fts5/fts5_tokenize.c in Sqlite. A unicode61 tokenizer configured to treat unicode "control-characters" (class Cc), was treating embedded nul characters as tokens. The issue was fixed in sqlite-3.34.0 and later.',
        Severity: 'NONE',
        PackageList: [
          {
            Name: 'libsqlite3-0',
            PackagePath: 'Not Specified',
            InstalledVersion: '3.31.1-4ubuntu0.3',
            FixedVersion: '3.31.1-4ubuntu0.4'
          }
        ]
      },
      {
        Id: 'CVE-2017-11164',
        Title: 'pcre: OP_KETRMAX feature in the match function in pcre_exec.c',
        Description:
          'In PCRE 8.41, the OP_KETRMAX feature in the match function in pcre_exec.c allows stack exhaustion (uncontrolled recursion) when processing a crafted regular expression.',
        Severity: 'UNKNOWN',
        PackageList: [
          {
            Name: 'libpcre3',
            PackagePath: 'Not Specified',
            InstalledVersion: '2:8.39-12ubuntu0.1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2020-35527',
        Title: 'sqlite: Out of bounds access during table rename',
        Description:
          'In SQLite 3.31.1, there is an out of bounds access problem through ALTER TABLE for views that have a nested FROM clause.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'libsqlite3-0',
            PackagePath: 'Not Specified',
            InstalledVersion: '3.31.1-4ubuntu0.3',
            FixedVersion: '3.31.1-4ubuntu0.4'
          }
        ]
      },
      {
        Id: 'CVE-2013-4235',
        Title: 'shadow-utils: TOCTOU race conditions by copying and removing directory trees',
        Description:
          'shadow: TOCTOU (time-of-check time-of-use) race condition when copying and removing directory trees',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'login',
            PackagePath: 'Not Specified',
            InstalledVersion: '1:4.8.1-1ubuntu5.20.04.2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'passwd',
            PackagePath: 'Not Specified',
            InstalledVersion: '1:4.8.1-1ubuntu5.20.04.2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-43618',
        Title: 'gmp: Integer overflow and resultant buffer overflow via crafted input',
        Description:
          'GNU Multiple Precision Arithmetic Library (GMP) through 6.2.1 has an mpz/inp_raw.c integer overflow and resultant buffer overflow via crafted input, leading to a segmentation fault on 32-bit platforms.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libgmp10',
            PackagePath: 'Not Specified',
            InstalledVersion: '2:6.2.0+dfsg-4',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-2509',
        Title: 'gnutls: Double free during gnutls_pkcs7_verify.',
        Description:
          'A vulnerability found in gnutls. This security flaw happens because of a double free error occurs during verification of pkcs7 signatures in gnutls_pkcs7_verify function.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'libgnutls30',
            PackagePath: 'Not Specified',
            InstalledVersion: '3.6.13-2ubuntu1.6',
            FixedVersion: '3.6.13-2ubuntu1.7'
          }
        ]
      },
      {
        Id: 'CVE-2021-39537',
        Title: 'ncurses: heap-based buffer overflow in _nc_captoinfo() in captoinfo.c',
        Description:
          'An issue was discovered in ncurses through v6.2-1. _nc_captoinfo in captoinfo.c has a heap-based buffer overflow.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libncurses6',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libncursesw6',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libtinfo6',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-base',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-bin',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-1587',
        Title: 'pcre2: Out-of-bounds read in get_recurse_data_length in pcre2_jit_compile.c',
        Description:
          'An out-of-bounds read vulnerability was discovered in the PCRE2 library in the get_recurse_data_length() function of the pcre2_jit_compile.c file. This issue affects recursions in JIT-compiled regular expressions caused by duplicate data transfers.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libpcre2-8-0',
            PackagePath: 'Not Specified',
            InstalledVersion: '10.34-7',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-29458',
        Title: 'ncurses: segfaulting OOB read',
        Description:
          'ncurses 6.3 before patch 20220416 has an out-of-bounds read and segmentation violation in convert_strings in tinfo/read_entry.c in the terminfo library.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libncurses6',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libncursesw6',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libtinfo6',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-base',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-bin',
            PackagePath: 'Not Specified',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2016-2781',
        Title: 'coreutils: Non-privileged session can escape to the parent session in chroot',
        Description:
          "chroot in GNU coreutils, when used with --userspec, allows local users to escape to the parent session via a crafted TIOCSTI ioctl call, which pushes characters to the terminal's input buffer.",
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'coreutils',
            PackagePath: 'Not Specified',
            InstalledVersion: '8.30-3ubuntu2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-3671',
        Title: 'samba: Null pointer dereference on missing sname in TGS-REQ',
        Description:
          'A null pointer de-reference was found in the way samba kerberos server handled missing sname in TGS-REQ (Ticket Granting Server - Request). An authenticated user could use this flaw to crash the samba server.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libasn1-8-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libgssapi3-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libhcrypto4-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libheimbase1-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libheimntlm0-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libhx509-5-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5-26-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libroken18-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libwind0-heimdal',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2016-20013',
        Title: '',
        Description:
          "sha256crypt and sha512crypt through 0.6 allow attackers to cause a denial of service (CPU consumption) because the algorithm's runtime is proportional to the square of the length of the password.",
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libc-bin',
            PackagePath: 'Not Specified',
            InstalledVersion: '2.31-0ubuntu9.9',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libc6',
            PackagePath: 'Not Specified',
            InstalledVersion: '2.31-0ubuntu9.9',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-35252',
        Title: 'curl: control code in cookie denial of service',
        Description: 'No description is available for this CVE.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libcurl4',
            PackagePath: 'Not Specified',
            InstalledVersion: '7.68.0-1ubuntu2.12',
            FixedVersion: '7.68.0-1ubuntu2.13'
          }
        ]
      },
      {
        Id: 'CVE-2021-37750',
        Title:
          'krb5: NULL pointer dereference in process_tgs_req() in kdc/do_tgs_req.c via a FAST inner body that lacks server field',
        Description:
          'The Key Distribution Center (KDC) in MIT Kerberos 5 (aka krb5) before 1.18.5 and 1.19.x before 1.19.3 has a NULL pointer dereference in kdc/do_tgs_req.c via a FAST inner body that lacks a server field.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'krb5-locales',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libgssapi-krb5-2',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libk5crypto3',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5-3',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5support0',
            PackagePath: 'Not Specified',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2020-35525',
        Title: 'sqlite: Null pointer derreference in src/select.c',
        Description:
          'In SQlite 3.31.1, a potential null pointer derreference was found in the INTERSEC query processing.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'libsqlite3-0',
            PackagePath: 'Not Specified',
            InstalledVersion: '3.31.1-4ubuntu0.3',
            FixedVersion: '3.31.1-4ubuntu0.4'
          }
        ]
      },
      {
        Id: 'CVE-2022-37434',
        Title:
          'zlib: a heap-based buffer over-read or buffer overflow in inflate in inflate.c via a large gzip header extra field',
        Description:
          'zlib through 1.2.12 has a heap-based buffer over-read or buffer overflow in inflate in inflate.c via a large gzip header extra field. NOTE: only applications that call inflateGetHeader are affected. Some common applications bundle the affected zlib source code but may be unable to call inflateGetHeader (e.g., see the nodejs/node reference).',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'zlib1g',
            PackagePath: 'Not Specified',
            InstalledVersion: '1:1.2.11.dfsg-2ubuntu1.3',
            FixedVersion: 'Not Specified'
          }
        ]
      }
    ]
  }
};

const mockCVEListFiltered = {
  CVEListForImage: {
    Tag: '',
    Page: { ItemCount: 20, TotalCount: 20 },
    Summary: {
      Count: 5,
      UnknownCount: 1,
      LowCount: 1,
      MediumCount: 1,
      HighCount: 1,
      CriticalCount: 1,
    },
    CVEList: mockCVEList.CVEListForImage.CVEList.filter((e) => e.Id.includes('2022'))
  }
};

const mockCVEListFilteredBySeverity = (severity) => {
  return {
    CVEListForImage: {
      Tag: '',
      Page: { ItemCount: 20, TotalCount: 20 },
      Summary: {
        Count: 5,
        UnknownCount: 1,
        LowCount: 1,
        MediumCount: 1,
        HighCount: 1,
        CriticalCount: 1,
      },
      CVEList: mockCVEList.CVEListForImage.CVEList.filter((e) => e.Severity.includes(severity))
    }
  };
};

const mockCVEListFilteredExclude = {
  CVEListForImage: {
    Tag: '',
    Page: { ItemCount: 20, TotalCount: 20 },
    Summary: {
      Count: 5,
      UnknownCount: 1,
      LowCount: 1,
      MediumCount: 1,
      HighCount: 1,
      CriticalCount: 1,
    },
    CVEList: mockCVEList.CVEListForImage.CVEList.filter((e) => !e.Id.includes('2022'))
  }
};

const mockCVEFixed = {
  pageOne: {
    ImageListWithCVEFixed: {
      Page: { TotalCount: 5, ItemCount: 3 },
      Results: [
        {
          Tag: '1.0.16'
        },
        {
          Tag: '0.4.33'
        },
        {
          Tag: '1.0.17'
        }
      ]
    }
  },
  pageTwo: {
    ImageListWithCVEFixed: {
      Page: { TotalCount: 5, ItemCount: 2 },
      Results: [
        {
          Tag: 'slim'
        },
        {
          Tag: 'latest'
        }
      ]
    }
  }
};

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Vulnerabilties page', () => {
  it('renders the vulnerabilities if there are any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByText('Total 5')).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByText(/CVE/)).toHaveLength(20));
  });

  it('renders the vulnerabilities by severity', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByText('Total 5')).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(20));
    expect(screen.getByLabelText('Medium')).toBeInTheDocument();
    const mediumSeverity = await screen.getByLabelText('Medium');
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredBySeverity('MEDIUM') } });
    fireEvent.click(mediumSeverity);
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(6));
    expect(screen.getByLabelText('High')).toBeInTheDocument();
    const highSeverity = await screen.getByLabelText('High');
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredBySeverity('HIGH') } });
    fireEvent.click(highSeverity);
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(1));
    expect(screen.getByLabelText('Critical')).toBeInTheDocument();
    const criticalSeverity = await screen.getByLabelText('Critical');
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredBySeverity('CRITICAL') } });
    fireEvent.click(criticalSeverity);
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(1));
    expect(screen.getByLabelText('Low')).toBeInTheDocument();
    const lowSeverity = await screen.getByLabelText('Low');
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredBySeverity('LOW') } });
    fireEvent.click(lowSeverity);
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(10));
    expect(screen.getByLabelText('Unknown')).toBeInTheDocument();
    const unknownSeverity = await screen.getByLabelText('Unknown');
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredBySeverity('UNKNOWN') } });
    fireEvent.click(unknownSeverity);
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(1));
    expect(screen.getByText('Total 5')).toBeInTheDocument();
    const totalSeverity = await screen.getByText('Total 5');
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredBySeverity('') } });
    fireEvent.click(totalSeverity);
    await waitFor(() => expect(screen.getAllByText(/CVE-/)).toHaveLength(20));
  });

  it('sends filtered query if user types in the search bar', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText(/CVE/)).toHaveLength(20));
    const cveSearchInput = screen.getByPlaceholderText(/search/i);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEListFiltered } });
    await userEvent.type(cveSearchInput, '2022');
    expect(cveSearchInput).toHaveValue('2022')
    await waitFor(() => expect(screen.queryAllByText(/2022/i)).toHaveLength(7));
    await waitFor(() => expect(screen.queryAllByText(/2021/i)).toHaveLength(1));
  });

  it('should have a collapsable search bar', async () => {
    jest.spyOn(api, 'get').
      mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } }).
      mockResolvedValue({ status: 200, data: { data: mockCVEListFilteredExclude } });
    render(<StateVulnerabilitiesWrapper />);
    const cveSearchInput = screen.getByPlaceholderText(/search/i);
    const expandSearch = cveSearchInput.parentElement.parentElement.parentElement.parentElement.childNodes[0];
    await fireEvent.click(expandSearch);
    await waitFor(() => 
      expect(screen.getAllByPlaceholderText("Exclude")).toHaveLength(1)
    );
    const excludeInput = screen.getByPlaceholderText("Exclude");
    userEvent.type(excludeInput, '2022');
    expect(excludeInput).toHaveValue('2022')
    await waitFor(() => expect(screen.queryAllByText(/2022/i)).toHaveLength(0));
    await waitFor(() => expect(screen.queryAllByText(/2021/i)).toHaveLength(6));
  })

  it('renders no vulnerabilities if there are not any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { CVEListForImage: { Tag: '', Page: {}, CVEList: [], Summary: {} } } }
    });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('No Vulnerabilities')).toHaveLength(1));
  });

  it('should show description for vulnerabilities', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } })
      .mockResolvedValue({ status: 200, data: { data: mockCVEFixed.pageOne } });
    render(<StateVulnerabilitiesWrapper />);
    const expandListBtn = await screen.findAllByTestId('ViewAgendaIcon');
    fireEvent.click(expandListBtn[0]);
    await waitFor(() => expect(screen.getAllByText(/Description/)).toHaveLength(20));
    await waitFor(() =>
      expect(screen.getAllByText(/CPAN 2.28 allows Signature Verification Bypass./i)).toHaveLength(1)
    );
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should find out which version fixes the CVEs', async () => {
    jest
      .spyOn(api, 'get')
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } })
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEFixed.pageOne } })
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEFixed.pageTwo } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    const expandListBtn = await screen.findAllByTestId('KeyboardArrowRightIcon');
    fireEvent.click(expandListBtn[1]);
    await waitFor(() => expect(screen.getByText('1.0.16')).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByText(/Load more/).length).toBe(1));
    const loadMoreBtn = screen.getAllByText(/Load more/)[0];
    await fireEvent.click(loadMoreBtn);
    await waitFor(() => expect(loadMoreBtn).not.toBeInTheDocument());
    expect(await screen.findByText('latest')).toBeInTheDocument();
  });

  it('should show the list of vulnerable packages for the CVEs', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: simpleMockCVEList } })
    render(<StateVulnerabilitiesWrapper />);
    const expandListBtn = await screen.findByTestId('expand-list-view-toggle');
    fireEvent.click(expandListBtn);
    const packageLists = await screen.findAllByTestId('cve-package-list');
    expect(packageLists.length).toEqual(2); // Data set has 2 CVEs, so 2 package lists

    const expectedData = [
        {
          Name: 'perl-base',
          PackagePath: 'Not Specified',
          InstalledVersion: '5.30.0-9ubuntu0.2',
          FixedVersion: 'Not Specified'
        },
        {
          Name: 'org.springframework:spring-web',
          PackagePath: 'usr/local/tomcat/webapps/spring4shell.war/WEB-INF/lib/spring-web-5.3.15.jar',
          InstalledVersion: '5.3.15',
          FixedVersion: '6.0.0'
        }
    ];

    for (let index = 0; index < 2; index++) {
      const expectedPackageData = expectedData[index];
      const container = packageLists[index];
      const pkgName = await within(container).findAllByTestId('cve-info-pkg-name');
      expect(pkgName).toHaveLength(1);
      expect(pkgName[0]).toHaveTextContent(expectedPackageData.Name);

      const pkgPath = await within(container).findAllByTestId('cve-info-pkg-path');
      expect(pkgPath).toHaveLength(1);
      expect(pkgPath[0]).toHaveTextContent(expectedPackageData.PackagePath);

      const pkgInstalledVer = await within(container).findAllByTestId('cve-info-pkg-install-ver');
      expect(pkgInstalledVer).toHaveLength(1);
      expect(pkgInstalledVer[0]).toHaveTextContent(expectedPackageData.InstalledVersion);

      const pkgFixedVer = await within(container).findAllByTestId('cve-info-pkg-fixed-ver');
      expect(pkgFixedVer).toHaveLength(1);
      expect(pkgFixedVer[0]).toHaveTextContent(expectedPackageData.FixedVersion);
    }
  });

  it('should allow export of vulnerabilities list', async () => {
    const xlsxMock = jest.createMockFromModule('xlsx');
    xlsxMock.writeFile = jest.fn();

    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    const downloadBtn = await screen.findAllByTestId('DownloadIcon');
    fireEvent.click(downloadBtn[0]);
    expect(await screen.findByTestId('export-csv-menuItem')).toBeInTheDocument();
    expect(await screen.findByTestId('export-excel-menuItem')).toBeInTheDocument();
    const exportAsCSVBtn = screen.getByText(/csv/i);
    expect(exportAsCSVBtn).toBeInTheDocument();
    global.URL.createObjectURL = jest.fn();
    await fireEvent.click(exportAsCSVBtn);
    expect(await screen.findByTestId('export-csv-menuItem')).not.toBeInTheDocument();
    fireEvent.click(downloadBtn[0]);
    const exportAsExcelBtn = screen.getByText(/xlsx/i);
    expect(exportAsExcelBtn).toBeInTheDocument();
    await fireEvent.click(exportAsExcelBtn);
    expect(await screen.findByTestId('export-excel-menuItem')).not.toBeInTheDocument();
  });

  it("should log an error when data can't be fetched for downloading", async () => {
    const xlsxMock = jest.createMockFromModule('xlsx');
    xlsxMock.writeFile = jest.fn();

    jest.spyOn(api, 'get').
      mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } }).
      mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    const downloadBtn = await screen.findAllByTestId('DownloadIcon');
    fireEvent.click(downloadBtn[0]);
    expect(await screen.findByTestId('export-csv-menuItem')).toBeInTheDocument();
    expect(await screen.findByTestId('export-excel-menuItem')).toBeInTheDocument();
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should expand/collapse the list of CVEs', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEFixed.pageOne } });
    const expandListBtn = await screen.findAllByTestId('ViewAgendaIcon');
    fireEvent.click(expandListBtn[0]);
    await waitFor(() => expect(screen.getAllByText('Fixed in')).toHaveLength(20));
    const collapseListBtn = await screen.findAllByTestId('ViewHeadlineIcon');
    fireEvent.click(collapseListBtn[0]);
    expect(await screen.findByText('Fixed in')).not.toBeVisible();
  });

  it('should handle fixed CVE query errors', async () => {
    jest
      .spyOn(api, 'get')
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } })
      .mockRejectedValue({ status: 500, data: {} });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const expandListBtn = await screen.findAllByTestId('KeyboardArrowRightIcon');
    fireEvent.click(expandListBtn[1]);
    await waitFor(() => expect(screen.getByText(/not fixed/i)).toBeInTheDocument());
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
